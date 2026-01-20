'use client';

import { cn } from '@/utils/lib';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import Map, { MapRef } from 'react-map-gl';
import Card from '../../ui/card';

// Map configuration constants
const MAX_ZOOM = 8;
const MIN_ZOOM = 3;
const INITIAL_VIEW_STATE = {
    latitude: 30.2672,
    longitude: -97.7431,
    zoom: MAX_ZOOM,
};

/**
 * Map card component for location display
 * Uses the 'map' variant for consistent map-related styling
 * Features interactive zoom controls and theme-aware styling
 */
export default function Location() {
    const [currentZoom, setCurrentZoom] = useState(MAX_ZOOM);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [isMapLoaded, setIsMapLoaded] = useState(false);

    const mapRef = useRef<MapRef>(null);
    const { theme } = useTheme();

    // Read Mapbox token - NEXT_PUBLIC_ vars are embedded at build time
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    // Handle zoom controls with debouncing
    const handleZoom = (zoomIn: boolean) => {
        if (isButtonDisabled) return;

        setCurrentZoom((prevZoom) => {
            const newZoom = prevZoom + (zoomIn ? 1 : -1);
            if (newZoom >= MIN_ZOOM && newZoom <= MAX_ZOOM) {
                zoomIn ? mapRef.current?.zoomIn() : mapRef.current?.zoomOut();
                setIsButtonDisabled(true);
                setTimeout(() => setIsButtonDisabled(false), 300);
                return newZoom;
            }
            return prevZoom;
        });
    };

    const mapStyle = `mapbox://styles/mapbox/${theme === 'dark' ? 'dark-v11' : 'streets-v12'}`;

    // If no Mapbox token, show placeholder instead of broken map
    if (!mapboxToken) {
        return (
            <Card className='relative size-full flex items-center justify-center bg-gray-50 dark:bg-dark-800'>
                <div className='text-center p-4'>
                    <div className='text-4xl mb-2'>📍</div>
                    <p className='text-sm font-medium text-gray-600 dark:text-gray-300'>Austin, TX</p>
                    <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>Location</p>
                </div>
            </Card>
        );
    }

    return (
        <Card className='relative size-full'>
            <div className='absolute inset-0 w-full h-full'>
            <Map
                mapboxAccessToken={mapboxToken}
                mapStyle={mapStyle}
                ref={mapRef}
                scrollZoom={false}
                dragPan={false}
                doubleClickZoom={false}
                attributionControl={false}
                dragRotate={false}
                pitchWithRotate={false}
                touchZoomRotate={false}
                antialias
                reuseMaps
                onLoad={() => setIsMapLoaded(true)}
                initialViewState={INITIAL_VIEW_STATE}
                maxZoom={MAX_ZOOM}
                    minZoom={MIN_ZOOM}
                    style={{ width: '100%', height: '100%' }}>
                {isMapLoaded ? (
                    <div className='absolute inset-x-3 bottom-3 flex items-center justify-between'>
                        <Button
                            isVisible={currentZoom > MIN_ZOOM}
                            onClick={() => handleZoom(false)}
                            aria-label='Zoom Out'>
                            <FaMinus />
                        </Button>
                        <Button
                            isVisible={currentZoom < MAX_ZOOM}
                            onClick={() => handleZoom(true)}
                            aria-label='Zoom In'>
                            <FaPlus />
                        </Button>
                    </div>
                ) : (
                    <div className='bg-dark-300 dark:bg-dark-900 absolute inset-0 size-full animate-pulse'></div>
                )}
            </Map>
            </div>
        </Card>
    );
}

// Zoom control button component
function Button({ 
    children, 
    isVisible, 
    onClick, 
    ...props 
}: { 
    children: React.ReactNode; 
    isVisible: boolean;
    onClick: () => void; 
    [key: string]: any; 
}) {
    return (
        <button
            className={cn(
                'cancel-drag flex size-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:scale-110 dark:bg-dark-800/80 dark:hover:bg-dark-800',
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
            )}
            onClick={onClick}
            {...props}>
            {children}
        </button>
    );
}
