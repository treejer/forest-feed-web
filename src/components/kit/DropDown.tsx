import React, {useCallback, useMemo, useRef, useState} from 'react';

import Image, {ImageProps} from 'next/image';
import {AnimatePresence, motion} from 'framer-motion';

import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';
import {Colors} from 'colors';
import {ChevronIcon, ChevronIconDirection} from '@forest-feed/components/kit/Icons/ChevronIcon';

export type DropDownItem = {
  id: string | number;
  text: string | number;
  image?: ImageProps['src'];
};

export type DropDownProps = {
  selected: DropDownItem;
  items: DropDownItem[];
  color?: Colors;
  hideText?: boolean;
  onChange: (item: DropDownItem) => void;
  disabled?: boolean;
};
export function DropDown(props: DropDownProps) {
  const {selected, items, hideText, color, disabled, onChange} = props;

  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <div ref={dropdownRef} className="dropdown dropdown-end">
        <button
          tabIndex={0}
          onClick={() => handleClick()}
          className="bg-white p-2 shadow-lg rounded-[5px] flex items-center disabled:opacity-50"
          disabled={disabled}
        >
          <RenderIf condition={!!selected.image}>
            <Image src={selected.image!} alt={selected.text.toString()} {...imageStyles} />
            <Spacer />
          </RenderIf>
          <RenderIf condition={!hideText}>
            <span className={`text-${color}`}>{selected.text}</span>
          </RenderIf>
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
              className="dropdown-content z-[1] menu shadow-lg rounded-[5px] w-52 bg-white p-0 mt-1"
            >
              {items.map(item => (
                <li
                  key={item.text}
                  className="flex flex-row justify-start items-center"
                  onClick={() => handleClick(item)}
                >
                  <div className="flex flex-row justify-start items-center w-full">
                    <RenderIf condition={!!item.image}>
                      <Image src={item.image!} alt={item.text.toString()} {...imageStyles} />
                    </RenderIf>
                    <span className={`text-${color} flex justify-start`}>{item.text}</span>
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
