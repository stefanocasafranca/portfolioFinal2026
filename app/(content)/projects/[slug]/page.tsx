import Anchor from '@/components/ui/anchor';
import Container from '@/components/ui/container';
import GridLayout from '@/components/grid/layout';
import { CustomMDX } from '@/components/ui/mdx';
import { siteConfig } from '@/config/site';
import { getAllProjects } from '@/utils/mdx';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import { FaArrowRight, FaX } from 'react-icons/fa6';
import { getProjectLayout } from '@/config/grid';
import ProjectImageWithDownload from '@/components/grid/widgets/project-image-with-download';

type Params = Promise<{ slug: string }>;

export const generateStaticParams = async () => getAllProjects().map((project) => ({ slug: project.slug }));

export const generateMetadata = async ({ params }: { params: Params }) => {
    const { slug } = await params;

    const project = getAllProjects().find((project) => project.slug === slug);
    if (!project) return;

    const { title, description } = project.metadata;

    return {
        title: `${title} — Projects`,
        description,
        openGraph: {
            title,
            description,
            type: 'article',
            url: `${siteConfig.url}/projects/${project.slug}`,
            authors: siteConfig.author,
            images: siteConfig.ogImage,
        },
        twitter: {
            title,
            description,
            images: siteConfig.ogImage,
        },
        alternates: {
            canonical: `${siteConfig.url}/projects/${project.slug}`,
        },
    };
};

const ProjectPage = async ({ params }: { params: Params }) => {
    const { slug } = await params;

    const project = getAllProjects().find((project) => project.slug === slug);

    if (!project) notFound();

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: project.metadata.title,
        description: project.metadata.description,
        author: [
            {
                '@type': 'Person',
                name: siteConfig.author,
                url: siteConfig.url,
            },
        ],
    };

    return (
        <>
            <Script
                id='json-ld'
                type='application/ld+json'
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <header className='flex items-center justify-center pt-10'>
                <Anchor className='inline-flex hover:mb-6 hover:scale-125' href='/'>
                    <FaX />
                    <div className='sr-only'>Close</div>
                </Anchor>
            </header>
            <main>
                <Container as='article' className='py-8'>
                    <h1 className='font-sf-pro text-3xl leading-relaxed'>{project.metadata.title}</h1>
                    <div className='grid grid-cols-2 gap-10 pb-8 max-md:grid-cols-1'>
                        <div>
                            <p className='text-xl leading-relaxed font-medium'>{project.metadata.description}</p>
                            <div className='flex flex-wrap items-center gap-3 pt-4'>
                                {JSON.parse(project.metadata.links).map((link: { url?: string; name: string }, index: number) => (
                                    link.url ? (
                                        <Anchor
                                            key={`${link.name}-${link.url}-${index}`}
                                            href={link.url}
                                            target='_blank'
                                            rel='noreferrer nofollow noopener'
                                            className='inline-flex px-5 py-3 text-sm'>
                                            {link.name}
                                            <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                                        </Anchor>
                                    ) : null
                                ))}
                            </div>
                        </div>
                        <div className='prose dark:prose-invert'>
                            <CustomMDX source={project.content} />
                        </div>
                    </div>
                </Container>
                {project.metadata.images && (
                    <GridLayout layouts={getProjectLayout(project.metadata.layout)} className='-mt-8 pb-16'>
                        {JSON.parse(project.metadata.images).map((image: { i: string; url: string; link?: string }) => {
                            const isUxResearchImages2 = slug === 'ux-research' && image.i === 'images-2';
                            const isUxResearchImages4 = slug === 'ux-research' && image.i === 'images-4';
                            const showDownload = isUxResearchImages2 || isUxResearchImages4;
                            
                            // Different PDFs for different images
                            let pdfPath = '';
                            let pdfFilename = '';
                            if (isUxResearchImages2) {
                                pdfPath = '/projects/ux-research/Document_as_System_for_AIMediatedEndUserProgramming.pdf';
                                pdfFilename = 'Document_as_System_for_AIMediatedEndUserProgramming.pdf';
                            } else if (isUxResearchImages4) {
                                pdfPath = '/projects/ux-research/Enhancing_Developer_Comprehension_of_Error_Notifications_through_Visual_Aid.pdf';
                                pdfFilename = 'Enhancing_Developer_Comprehension_of_Error_Notifications_through_Visual_Aid.pdf';
                            }
                            
                            return (
                                <div key={image.i}>
                                    <ProjectImageWithDownload
                                        imageUrl={image.url}
                                        alt={project.metadata.title}
                                        showDownload={showDownload}
                                        pdfPath={pdfPath}
                                        pdfFilename={pdfFilename}
                                        link={image.link}
                                    />
                                </div>
                            );
                        })}
                    </GridLayout>
                )}
            </main>
        </>
    );
};

export default ProjectPage;
