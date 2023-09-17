import Image from 'next/image';

export function DaiIcon() {
  return (
    <Image
      className="w-[20px] h-[20px] lg:w-[30px] lg:h-[30px]"
      width={30}
      height={30}
      src="/assets/images/daiToken.svg"
      alt="Dai"
    />
  );
}
