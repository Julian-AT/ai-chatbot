'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { PlusIcon, TextIcon } from 'lucide-react';

const sidebarItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    active: false,
  },
  {
    label: 'Interiorly AI',
    href: '/interiorly-ai',
    active: true,
  },
  {
    label: 'Gallery',
    href: '/gallery',
    active: false,
  },
  {
    label: 'Activity',
    href: '/activity',
    active: false,
  },
  {
    label: 'Projects',
    href: '/projects',
    active: false,
  },
];

const sidebarWorkspaceItems = [
  {
    label: 'Design Inspiration',
    image: '/images/step1.webp',
    notificationCounter: 23,
  },
  {
    label: 'Design Inspiration',
    image: '/images/step2.webp',
    notificationCounter: 345,
  },
  {
    label: 'Design Inspiration',
    image: '/images/step3.webp',
    notificationCounter: 568,
  },
];

const sidebarDocumentItems = [
  {
    label: 'Bedroom Redesign',
    notificationCounter: 52,
    color: 'bg-pink-300',
    colorText: 'text-pink-700',
  },
  {
    label: 'Bedroom Redesign',
    notificationCounter: 15,
    color: 'bg-cyan-300',
    colorText: 'text-cyan-700',
  },
  {
    label: 'Bedroom Redesign',
    notificationCounter: 5,
    color: 'bg-violet-300',
    colorText: 'text-violet-700',
  },
  {
    label: 'Bedroom Redesign',
    notificationCounter: 2,
    color: 'bg-green-300',
    colorText: 'text-green-700',
  },
];

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-1 h-screen border bg-white">
      <SidebarHeader className="bg-white">
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-1 items-center p-2"
            >
              <Image
                src="/images/logo.png"
                alt="Interiorly Logo"
                width={36}
                height={36}
              />
              <span className="text-2xl font-medium text-black px-2 hover:bg-muted rounded-md cursor-pointer">
                Interiorly
              </span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarGroup className="bg-white">
        {sidebarItems.map((item, idx) => (
          <Button
            key={item.href}
            variant="ghost"
            asChild
            className={cn(
              'justify-start text-base text-muted-foreground my-0.5',
              item.active && 'bg-primary bg-[#5577FF] text-white',
            )}
          >
            <Link href={item.href}>
              <Image
                src={`/images/${idx + 1}.png`}
                alt={item.label}
                width={24}
                height={24}
                className=" object-cover size-4 flex-shrink-0"
              />
              {item.label}
            </Link>
          </Button>
        ))}
      </SidebarGroup>
      <SidebarGroup className="bg-white">
        <SidebarGroupLabel className="text-muted-foreground/50 uppercase text-base font-normal flex justify-between">
          Workspaces
          <Button
            variant="ghost"
            className="h-fit size-3 p-2.5 bg-blue-400/50 text-blue-700 overflow-hidden"
          >
            <PlusIcon className="size-2" />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {sidebarWorkspaceItems.map((item, i) => (
            <Button
              key={item.label + i.toString()}
              variant="ghost"
              className="px-2 w-full text-muted-foreground/80"
            >
              <div className="flex flex-row gap-2 items-center w-full justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="rounded-full object-cover size-8 flex-shrink-0"
                  />
                  <span className="truncate font-base">{item.label}</span>
                </div>
                <span className="text-muted-foreground/50 flex-shrink-0 text-right text-xs">
                  {item.notificationCounter}
                </span>
              </div>
            </Button>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup className="bg-white flex-1">
        <SidebarGroupLabel className="text-muted-foreground/50 uppercase text-base font-normal flex justify-between">
          Documents
          <Button
            variant="ghost"
            className="h-fit size-3 p-2.5 bg-blue-400/50 text-blue-700 overflow-hidden"
          >
            <PlusIcon className="size-2" />
          </Button>
        </SidebarGroupLabel>
        <SidebarGroupContent>
          {sidebarDocumentItems.map((item, i) => (
            <Button
              key={item.label + i.toString()}
              variant="ghost"
              className="px-2 w-full"
            >
              <div className="flex flex-row gap-2 items-center w-full justify-between">
                <div className="flex flex-row gap-2 items-center">
                  <div
                    className={cn(
                      'flex items-center justify-center w-5 h-[22px] rounded-sm',
                      item.color,
                    )}
                  >
                    <TextIcon className="size-12 text-muted-foreground/50" />
                  </div>

                  <span className="truncate font-base">{item.label}</span>
                </div>
                <span className="text-muted-foreground/50 flex-shrink-0 text-right text-xs">
                  {item.notificationCounter}
                </span>
              </div>
            </Button>
          ))}
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarFooter className="bg-white">
        {user && <SidebarUserNav user={user} />}
      </SidebarFooter>
    </Sidebar>
  );
}
