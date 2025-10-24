'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';

export function RevalidateButton({
  tag,
  label,
  revalidateAction,
}: {
  tag: string;
  label: string;
  revalidateAction: (tag: string) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      onClick={() =>
        startTransition(() => {
          revalidateAction(tag);
        })
      }
      disabled={isPending}
      className='p-2 bg-blue-500 text-white rounded'
    >
      {isPending ? 'Revalidating…' : `Revalidate ${label}`}
    </Button>
  );
}
