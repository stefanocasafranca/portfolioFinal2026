import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { Serialized } from "@langchain/core/load/serializable";
import { BaseMessage } from "@langchain/core/messages";
import { sql } from "@vercel/postgres";

/**
 * Custom LangChain Callback Handler for logging chat interactions to Vercel Postgres.
 * This handler captures business-level analytics such as project mentions.
 */
export class PostgresCallbackHandler extends BaseCallbackHandler {
  name = "postgres_callback_handler";
  
  private sessionId: string;
  private userIp: string | null;
  private userAgent: string | null;
  private referer: string | null;
  private userMessage: string;
  private startTime: number;

  constructor(fields: {
    sessionId: string;
    userIp: string | null;
    userAgent: string | null;
    referer: string | null;
    userMessage: string;
  }) {
    super();
    this.sessionId = fields.sessionId;
    this.userIp = fields.userIp;
    this.userAgent = fields.userAgent;
    this.referer = fields.referer;
    this.userMessage = fields.userMessage;
    this.startTime = Date.now();
  }

  async handleChatModelStart(
    llm: Serialized,
    messages: BaseMessage[][],
    runId: string
  ): Promise<void> {
    // We could log the start of the interaction here if needed
  }

  async handleLLMEnd(output: any, runId: string): Promise<void> {
    const assistantResponse = output.generations[0][0].text;
    const responseTimeMs = Date.now() - this.startTime;
    
    try {
      if (!process.env.POSTGRES_URL) {
        return;
      }

      const isMobile = this.userAgent?.toLowerCase().includes('mobile') || false;

      // Log to Postgres
      await sql`
        INSERT INTO chat_logs (
          session_id,
          user_message,
          assistant_response,
          response_time_ms,
          user_ip,
          user_agent,
          referer,
          is_mobile
        ) VALUES (
          ${this.sessionId},
          ${this.userMessage},
          ${assistantResponse},
          ${responseTimeMs},
          ${this.userIp},
          ${this.userAgent},
          ${this.referer},
          ${isMobile}
        )
      `;
    } catch (error) {
      console.error("Failed to log chat interaction via PostgresCallbackHandler:", error);
    }
  }

  async handleLLMError(err: any, runId: string): Promise<void> {
    console.error("LLM Error captured in PostgresCallbackHandler:", err);
  }
}
