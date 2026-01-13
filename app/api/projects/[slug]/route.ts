import { getAllProjects } from '@/utils/mdx';
import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const project = getAllProjects().find((p) => p.slug === slug);

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  return NextResponse.json({
    metadata: project.metadata,
    content: project.content,
    slug: project.slug,
  });
}

