import Link from 'next/link';

import { Book, BookAudio } from 'lucide-react';

import { DropdownMenuItem } from '@/components/ui/dropdown-menu';

const externalLinks = [
  {
    name: 'Home',
    href: 'https://studyatcentral.com',
    icon: <Book className="mr-2 h-4 w-4" />,
  },
  {
    name: 'Forum',
    href: 'https://forum.studyatcentral.com/',
    icon: <BookAudio className="mr-2 h-4 w-4" />,
  },
];

export function ExternalLinkItems() {
  return (
    <>
      {externalLinks.map((link) => (
        <DropdownMenuItem key={link.name} asChild>
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            {link.icon}
            <span>{link.name}</span>
          </Link>
        </DropdownMenuItem>
      ))}
    </>
  );
}
