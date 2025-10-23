// app/actions/revalidate.ts
'use server';
import { revalidateTag } from 'next/cache';

export async function revalidateCacheTag(tag: string) {
  revalidateTag(tag);
}
