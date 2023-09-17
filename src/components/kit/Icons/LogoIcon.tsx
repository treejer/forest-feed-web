import Image from 'next/image';

export function Logo() {
  return <Image className="w-12 md:auto h-auto" src="/assets/images/Logo.png" alt="logo" width={48} height={54} />;
}
