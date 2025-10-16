'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { OptionsType } from '@/types/type';

export function ComboBox({
  selectedValue,
  placeholder,
  ...props
}: {
  selectedValue: string;
  placeholder: string;
  options: OptionsType;
  setValue: (value: string) => void;
  canAddNewValues?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => setIsDesktop(window.innerWidth >= 768);
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const buttonContent = (
    <>
      {selectedValue ? selectedValue : placeholder}
      <ChevronsUpDown className='ml-2 text-primary opacity-70' />
    </>
  );

  if (isDesktop) {
    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
      >
        <PopoverTrigger asChild>
          <Button
            variant='secondary'
            role='combobox'
            aria-expanded={open}
            className='text-foreground w-full capitalize'
          >
            {buttonContent}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0'>
          <StatusList
            setOpen={setOpen}
            selectedValue={selectedValue}
            {...props}
            placeholder={placeholder}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
    >
      <DrawerTrigger asChild>
        <Button
          variant='secondary'
          className='text-foreground w-full capitalize'
        >
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
  canAddNewValues = true,
}: {
  setOpen: (open: boolean) => void;
  selectedValue: string;
  setValue: (value: string) => void;
  options: OptionsType;
  placeholder: string;
  canAddNewValues?: boolean;
}) {
  const [search, setSearch] = React.useState('');

  return (
    <Command>
      <CommandInput
        placeholder={placeholder}
        className='h-9 p-3'
        onValueChange={setSearch}
      />
      <CommandList className='m-2'>
        <CommandEmpty>
          {canAddNewValues ? (
            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => {
                setValue(search);
                setOpen(false);
              }}
            >
              <Plus className='mr-2 h-4 w-4 text-primary' /> Add{' '}
              <span className='text-primary'>&quot;{search}&quot;</span>{' '}
              {placeholder.split(' ')[2]}
            </Button>
          ) : (
            <span className='text-muted-foreground'>No results found.</span>
          )}
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
              className='p-3 text-primary capitalize'
            >
              {option.name}
              <Check
                className={cn(
                  'ml-2 h-5 w-5 text-primary',
                  selectedValue === option.name ? 'opacity-100' : 'opacity-0'
                )}
              />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
