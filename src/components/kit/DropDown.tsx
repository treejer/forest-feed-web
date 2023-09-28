import React, {useCallback, useMemo, useRef, useState} from 'react';

import Image, {ImageProps} from 'next/image';
import {AnimatePresence, motion} from 'framer-motion';

import {ChevronIcon, ChevronIconDirection} from '@forest-feed/components/kit/Icons/ChevronIcon';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {useOnClickOutSide} from '@forest-feed/hooks/useOnClickOutSide';
import {Color, colors} from 'colors';

export type DropDownItem = {
  id: string | number;
  text: number | string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactNodeArray;
  image?: ImageProps['src'];
};

export type DropDownProps = {
  selected: DropDownItem;
  items: DropDownItem[];
  color?: Color;
  activeColor?: Color;
  hideText?: boolean;
  onChange: (item: DropDownItem) => void;
  disabled?: boolean;
  bgColor?: Color;
  shadow?: boolean;
  className?: string;
};

const possibleColors = Object.keys(colors);

export function DropDown(props: DropDownProps) {
  const {selected, items, hideText, color, activeColor, disabled, bgColor = Color.white, className, onChange} = props;

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutSide<HTMLDivElement>(dropdownRef, () => setOpen(false));

  const imageStyles = useMemo(
    () => ({
      width: 30,
      height: 30,
    }),
    [],
  );

  const handleClick = useCallback(
    (item?: DropDownItem) => {
      setOpen(prevState => !prevState);
      dropdownRef?.current?.classList.toggle('dropdown-open');
      if (item) onChange(item);
    },
    [onChange],
  );

  return (
    <div className="transition-all">
      <div ref={dropdownRef} className={`dropdown dropdown-end ${className}`}>
        <button
          tabIndex={0}
          onClick={() => handleClick()}
          className={`bg-${bgColor} p-2 shadow-lg rounded-[5px] flex items-center justify-between disabled:opacity-50 ${className}`}
          disabled={disabled}
        >
          <div className="flex items-center">
            <RenderIf condition={!!selected.image}>
              <Image src={selected.image!} alt={selected.text.toString()} {...imageStyles} />
              <Spacer />
            </RenderIf>
            <RenderIf condition={!hideText}>
              <span className={`text-${activeColor} text-sm`}>{selected.text}</span>
            </RenderIf>
          </div>
          <Spacer />
          <ChevronIcon direction={open ? ChevronIconDirection.up : ChevronIconDirection.down} />
        </button>
        <AnimatePresence>
          {open ? (
            <motion.ul
              tabIndex={0}
              initial={{opacity: 0, y: -10}}
              animate={{opacity: 1, y: 0}}
              exit={{opacity: 0, y: -10}}
              transition={{duration: 0.2}}
              className={`dropdown-content z-50 menu shadow-lg rounded-[5px] w-52 bg-${bgColor} p-0 mt-1`}
            >
              {items.map(item => (
                <li
                  key={item.text.toString()}
                  className="flex flex-row justify-start items-center"
                  onClick={() => handleClick(item)}
                >
                  <div className="flex flex-row justify-start items-center w-full">
                    <RenderIf condition={!!item.image}>
                      <Image
                        src={item.image!}
                        alt={item.text.toString()}
                        {...imageStyles}
                        placeholder="blur"
                        blurDataURL={item.image as string}
                      />
                    </RenderIf>
                    <span className={`text-${selected.id === item.id ? activeColor : color} flex justify-start`}>
                      {item.text}
                    </span>
                  </div>
                </li>
              ))}
            </motion.ul>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
