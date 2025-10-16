'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface LatestUpdatesDialogProps {
  open: boolean;
  onClose: () => void;
  version?: string;
}

export default function LatestUpdatesDialog({
  open,
  onClose,
  version = 'v1',
}: LatestUpdatesDialogProps) {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    if (open) {
      const seen = localStorage.getItem(`seenUpdates_${version}`);
      if (!seen) setIsOpen(true);
    }
  }, [open, version]);

  const handleClose = () => {
    localStorage.setItem(`seenUpdates_${version}`, 'true');
    setIsOpen(false);
    onClose();
  };

  const sections = [
    {
      title: 'Theme & Layout',
      color: 'bg-green-500',
      items: [
        'Theme is now darker',
        'Updated layout for the entire site with new fields',
        'New and improved look for mobile and desktop',
        'Visualized types by color',
      ],
    },
    {
      title: 'Add Payout',
      color: 'bg-blue-500',
      items: [
        'Transactions is now Payouts',
        'Combined adding and selecting of store & company',
        'Added Credit type',
        'ACH Payment Type now has "Date to Withdraw" for automatic/future payments',
      ],
    },
    {
      title: 'Verify Checks/ACH',
      color: 'bg-yellow-500',
      items: [
        'Deposit checks is now Verify Checks/ACH',
        'Swipe left on mobile to mark posted checks as withdrawn',
        'ACH payments automatically removed once date has passed',
      ],
    },
    {
      title: 'Dashboard',
      color: 'bg-purple-500',
      items: [
        'Overview now has become Dashboard',
        'View ACH Payment Type along with Checks to Withdraw',
        'See up to 10 payouts at once',
        'Filter by company, type, and date',
        'Payouts automatically sorted by date descending',
        'Dashboard link removed from dropdown/menu',
        'Access dashboard by clicking on Vendor Payouts',
      ],
    },
  ];

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <DialogContent className='w-[90vw] sm:max-w-xl md:max-w-2xl rounded-xl border border-primary bg-card shadow-xl p-6 sm:p-8 animate-fadeIn overflow-auto max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-primary text-xl sm:text-2xl font-bold'>
            📢 Latest Updates
          </DialogTitle>
          <DialogDescription className='text-primary/90 mt-2 text-base sm:text-lg'>
            Here are the newest improvements and features:
          </DialogDescription>
        </DialogHeader>

        <div className='mt-6 space-y-6'>
          {sections.map((section) => (
            <div
              key={section.title}
              className='p-4 sm:p-6 rounded-xl bg-primary/5 border border-primary/10 shadow-sm'
            >
              <div className='flex items-center gap-3 mb-3'>
                <span className={`w-4 h-4 rounded-full ${section.color}`} />
                <strong className='text-primary font-semibold text-base sm:text-lg'>
                  {section.title}
                </strong>
              </div>
              <ul className='list-disc list-inside ml-6 space-y-2 text-muted-foreground text-sm sm:text-base'>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <DialogFooter className='mt-6 flex justify-end'>
          <Button
            onClick={handleClose}
            className='bg-primary hover:bg-primary/90 text-primary-foreground'
          >
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
