import { siteConfig } from '@/config/site';
import { getAllPosts, getAllProjects } from '@/utils/mdx';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const routes = [''].map((route) => ({
        url: `${siteConfig.url}${route}`,
        lastModified: new Date(),
    }));

    const posts = getAllPosts().map((post) => ({
        url: `${siteConfig.url}/posts/${post.slug}`,
        lastModified: post.metadata.date,
    }));

    const projects = getAllProjects().map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified: new Date(),
    }));

    return [...routes, ...posts, ...projects];
}
