'use client';

import {
  AlertTriangle,
  Store,
  Briefcase,
  Tag,
  DollarSign,
  FileText,
  CheckCircle,
  Calendar,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import z from 'zod';
import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { Progress } from '../ui/progress';
import { FormSchema } from '@/types/type';
import { formatUtcAsEstDate } from '@/lib/utils/date-format';

export default function ConfirmPayout({
  confirmOpen,
  setConfirmOpen,
  getFormValues,
  handleConfirmSubmit,
  loading,
}: {
  confirmOpen: boolean;
  setConfirmOpen: Dispatch<SetStateAction<boolean>>;
  getFormValues: () => z.infer<typeof FormSchema>;
  handleConfirmSubmit: (values: z.infer<typeof FormSchema>) => void;
  loading: boolean;
}) {
  const values = getFormValues();
  const [canSubmit, setCanSubmit] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    setCanSubmit(false);
    setProgressPercent(0);
    const duration = 3000; // 3 seconds
    const intervalTime = 50; // update every 50ms
    const increment = (intervalTime / duration) * 100; // percent per interval

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(interval);
          setCanSubmit(true);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [confirmOpen]);

  return (
    <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
      <DialogContent className='max-w-md rounded-xl border border-primary bg-card shadow-lg p-6'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-primary'>
            <AlertTriangle className='w-6 h-6' />
            Confirm Submission
          </DialogTitle>
          <DialogDescription className='text-sm text-red-500 mt-1'>
            ⚠️ Once submitted, this payout cannot be edited. Please confirm the
            details below.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-4 text-sm'>
          <p className='flex items-center gap-2'>
            <Store className='w-5 h-5 text-primary' />
            <strong>Store:</strong> {values.storeName}
          </p>
          <p className='flex items-center gap-2'>
            <Briefcase className='w-5 h-5 text-primary' />
            <strong>Company:</strong> {values.companyName}
          </p>
          <p className='flex items-center gap-2'>
            <Tag className='w-5 h-5 text-primary' />
            <strong>Type:</strong> {values.type}
          </p>
          <p className='flex items-center gap-2'>
            <DollarSign className='w-5 h-5 text-primary' />
            <strong>Amount:</strong> ${values.amount}
          </p>
          <p className='flex items-center gap-2'>
            <FileText className='w-5 h-5 text-primary' />
            <strong>Invoice #:</strong> {values.invoiceNumber}
          </p>
          {values.checkNumber && (
            <p className='flex items-center gap-2'>
              <CheckCircle className='w-5 h-5 text-primary' />
              <strong>Check #:</strong> {values.checkNumber}
            </p>
          )}
          {values.dateToWithdraw && (
            <p className='flex items-center gap-2'>
              <Calendar className='w-5 h-5 text-primary' />
              <strong>Date to Withdraw:</strong>
              {formatUtcAsEstDate(values.dateToWithdraw)}
            </p>
          )}
        </div>

        <DialogFooter className='mt-6 flex gap-4 justify-end items-center relative'>
          <Button
            variant='outline'
            onClick={() => setConfirmOpen(false)}
            className='border-primary text-primary hover:bg-primary/10'
          >
            Cancel
          </Button>

          <div className='relative'>
            <Button
              onClick={() => handleConfirmSubmit(values)}
              disabled={!canSubmit || loading}
              className='bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center relative'
            >
              {loading ? 'Submitting...' : 'Confirm & Submit'}
            </Button>

            {!canSubmit && (
              <div className='absolute inset-0 flex items-center justify-center pointer-events-none'>
                <Progress value={progressPercent} className='w-8 h-8' />
              </div>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
