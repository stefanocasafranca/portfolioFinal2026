-- Vercel Postgres Database Schema for Chat Analytics
-- Run this SQL in your Vercel Postgres dashboard after creating the database

-- Chat logs table to store all user interactions
CREATE TABLE IF NOT EXISTS chat_logs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255) NOT NULL,
  user_message TEXT NOT NULL,
  assistant_response TEXT NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_time_ms INTEGER,
  tokens_used INTEGER,
  user_ip VARCHAR(45),
  user_agent TEXT,
  referer TEXT,
  is_mobile BOOLEAN DEFAULT false
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_chat_logs_session ON chat_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_logs_timestamp ON chat_logs(timestamp DESC);

-- Useful analytics queries:

-- 1. Most asked questions (last 30 days)
-- SELECT user_message, COUNT(*) as count
-- FROM chat_logs
-- WHERE timestamp > NOW() - INTERVAL '30 days'
-- GROUP BY user_message
-- ORDER BY count DESC
-- LIMIT 10;

-- 2. Daily conversation volume
-- SELECT DATE(timestamp) as day, COUNT(*) as conversations
-- FROM chat_logs
-- GROUP BY DATE(timestamp)
-- ORDER BY day DESC;

-- 3. Average response time and length
-- SELECT
--   AVG(response_time_ms) as avg_response_time_ms,
--   AVG(LENGTH(assistant_response)) as avg_response_length,
--   AVG(tokens_used) as avg_tokens
-- FROM chat_logs;

-- 4. Mobile vs Desktop usage
-- SELECT is_mobile, COUNT(*) as count
-- FROM chat_logs
-- GROUP BY is_mobile;

-- 5. Peak usage hours
-- SELECT EXTRACT(HOUR FROM timestamp) as hour, COUNT(*) as count
-- FROM chat_logs
-- GROUP BY EXTRACT(HOUR FROM timestamp)
-- ORDER BY count DESC;
