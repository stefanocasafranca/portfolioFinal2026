import { FaArrowRight, FaEnvelope } from 'react-icons/fa6';
import Anchor from '../../ui/anchor';
import Card from '../../ui/card';

export default function Email() {
    return (
        <Card className='relative flex h-full flex-col items-center justify-center bg-[#EA4335] dark:bg-[#EA4335]'>
            <div className='absolute bottom-3 left-3'>
                <Anchor className='cancel-drag' href='mailto:your-actual-email@example.com' target='_blank'>
                    <FaArrowRight className='-rotate-45 transition-transform duration-300 group-hover:rotate-0' />
                    <span className='sr-only'>Email</span>
                </Anchor>
            </div>
            <FaEnvelope size='4rem' color='white' />
        </Card>
    );
} 