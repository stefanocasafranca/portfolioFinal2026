import Anchor from '@/components/ui/anchor';
import Card from '@/components/ui/card';
import Container from '@/components/ui/container';
import { CustomMDX } from '@/components/ui/mdx';
import { getAllMethods } from '@/utils/mdx';
import { notFound } from 'next/navigation';
import { FaArrowRight, FaX } from 'react-icons/fa6';
import Image from 'next/image';
import GridLayout from '@/components/grid/layout';
import { projectLayouts } from '@/config/grid';

type Params = Promise<{ slug: string }>;

function safeParse(jsonString: string | undefined) {
  if (!jsonString || !jsonString.trim()) return [];
  try {
    return JSON.parse(jsonString);
  } catch {
    return [];
  }
}

export default async function MethodPage({ params }: { params: Params }) {
  const { slug } = await params;
  const method = getAllMethods().find((m) => m.slug === slug);
  if (!method) notFound();

  const { title, description, links, images } = method.metadata;
  const parsedLinks = safeParse(links);
  const parsedImages = safeParse(images);

  return (
    <>
      <header className='flex items-center justify-center pt-10'>
        <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
          <FaX />
          <div className='sr-only'>Close</div>
        </Anchor>
      </header>
      <main>
        <Container as='article' className='py-8'>
          <h1 className='font-sf-pro text-3xl leading-relaxed'>{title}</h1>
          <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
            <div>
              {description && <p className='text-xl leading-relaxed font-medium'>{description}</p>}
              {parsedLinks.length > 0 && (
                <div className='flex flex-wrap items-center gap-3 pt-4'>
                  {parsedLinks.map((link: { url: string; name: string }) => (
                    <Anchor
                      key={`${link.name}-${link.url}`}
                      href={link.url}
                      target='_blank'
                      rel='noreferrer nofollow noopener'
                      className='inline-flex px-5 py-3 text-sm'>
                      {link.name}
                      <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    </Anchor>
                  ))}
                </div>
              )}
            </div>
            <div className='prose dark:prose-invert'>
              <CustomMDX source={method.content} />
            </div>
          </div>
        </Container>
        {parsedImages.length > 0 && (
          <GridLayout layouts={projectLayouts} className='-mt-8 pb-16'>
            {parsedImages.map((image: { i: string; url: string }) => (
              <div key={image.i} className='h-full'>
                <Card className='relative h-full'>
                  <Image
                    src={image.url}
                    alt={title}
                    fill
                    className='object-cover'
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    draggable={false}
                  />
                </Card>
              </div>
            ))}
          </GridLayout>
        )}
      </main>
    </>
  );
} 