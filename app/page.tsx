'use client';

import Container from '@/components/ui/container';
import GridLayout from '@/components/grid/layout';
import { gridItems, layouts, CardCategory } from '@/config/grid';
import { siteConfig } from '@/config/site';
import GridItem from '@/components/grid/item';
import Navbar from '@/components/ui/navbar';
import { useState } from 'react';

export default function Home() {
    // Lightweight state management for filtering - following directives
    const [selectedCategory, setSelectedCategory] = useState<CardCategory | 'all'>('all');

    return (
        <>
            <Container as='header' className='flex items-center justify-between py-0'>
                <h1 className='hidden'>{siteConfig.title}</h1>
            </Container>
            <Navbar 
                selectedCategory={selectedCategory} 
                onCategoryChange={setSelectedCategory} 
            />
            <main className='py-8'>
                <GridLayout layouts={layouts}>
                    {gridItems.map((item) => (
                        <GridItem 
                            key={item.i} 
                            id={item.i} 
                            component={item.component}
                            category={item.category}
                            isHero={item.isHero}
                            selectedCategory={selectedCategory}
                        />
                    ))}
                </GridLayout>
            </main>
        </>
    );
}
