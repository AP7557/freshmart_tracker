'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { OptionsType } from '@/types/type';

export function MultiSelectComboBox({
  selectedValue,
  placeholder,
  ...props
}: {
  selectedValue: string[];
  placeholder: string;
  options: OptionsType;
  setValue: (value: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  const buttonContent = (
    <>
      {selectedValue.length ? `${selectedValue.length} selected` : placeholder}
      <ChevronsUpDown className='ml-2 text-primary opacity-70' />
    </>
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant='secondary' className='text-foreground w-full'>
          {buttonContent}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{placeholder}</DrawerTitle>
        </DrawerHeader>
        <div className='mt-4 border-t'>
          <StatusList
            setOpen={setOpen}
            selectedValue={selectedValue}
            placeholder={placeholder}
            {...props}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  options,
  selectedValue,
  setValue,
  placeholder,
}: {
  setOpen: (open: boolean) => void;
  selectedValue: string[];
  setValue: (value: string) => void;
  options: OptionsType;
  placeholder: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={placeholder} className='h-9 p-3' />
      <CommandList className='m-2'>
        <CommandEmpty>
          <span className='text-muted-foreground'>No results found.</span>
        </CommandEmpty>
        <CommandGroup>
          {options.map((option) => (
            <CommandItem
              key={option.id}
              value={option.name}
              onSelect={() => {
                setValue(option.name);
                setOpen(false);
              }}
              className='p-3 text-primary'
            >
              {option.name}
              <Check
                className={cn(
                  'ml-2 h-5 w-5 text-primary',
                  selectedValue.includes(option.name)
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
