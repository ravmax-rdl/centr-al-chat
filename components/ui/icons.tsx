'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

import { cn } from '@/lib/utils';

function IconLogo({ className, ...props }: React.ComponentProps<'div'>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to show based on theme
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoSrc = currentTheme === 'dark' ? '/logolight.svg' : '/logodark.svg';

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return <div className={cn('relative h-4 w-4', className)} {...props} />;
  }

  return (
    <div className={cn('relative h-4 w-4', className)} {...props}>
      <Image src={logoSrc} alt="Logo" fill className="object-contain" />
    </div>
  );
}

function IconLogoNamed({ className, ...props }: React.ComponentProps<'div'>) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which named logo to show based on theme
  const currentTheme = theme === 'system' ? resolvedTheme : theme;
  const logoSrc = currentTheme === 'dark' ? '/logonamelight.svg' : '/logonamedark.svg';

  // Return a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return <div className={cn('relative h-8 w-auto', className)} {...props} />;
  }

  return (
    <div className={cn('relative h-8 w-auto', className)} {...props}>
      <Image src={logoSrc} alt="Logo" fill className="object-contain" />
    </div>
  );
}

export { IconLogo, IconLogoNamed };
