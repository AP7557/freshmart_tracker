'use client';
import { useTransition } from 'react';
import { revalidateCacheTag } from './revalidate';

export function RevalidateButton({
  tag,
  label,
}: {
  tag: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className='p-2 bg-blue-500 text-white rounded'
      onClick={() =>
        startTransition(() => {
          revalidateCacheTag(tag);
        })
      }
      disabled={isPending}
    >
      {isPending ? 'Revalidating...' : `Revalidate ${label}`}
    </button>
  );
}
