import { cn } from '@/utils/lib';

const tabs = [
  { label: 'All', selected: true },
  { label: 'About', selected: false },
  { label: 'Projects', selected: false },
  { label: 'Media', selected: false },
];

export default function Navbar() {
  return (
    <div className="w-full flex justify-center my-8">
      <div className="bg-[#f6f2f2] rounded-full px-6 py-2">
        <nav>
          <div className="inline-flex items-center rounded-full bg-white shadow-sm px-6 py-1 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.label}
                className={cn(
                  'font-sf-pro font-semibold text-sm transition-all flex items-center justify-center px-5 py-2 rounded-full',
                  tab.selected
                    ? 'bg-white text-black shadow-sm scale-105' // selected: white pill, slightly larger
                    : 'bg-transparent text-black/90 hover:bg-gray-100', // unselected: no bg, bold, black
                  'focus:outline-none',
                  'mx-1'
                )}
                type="button"
                tabIndex={0}
                aria-current={tab.selected ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
} 