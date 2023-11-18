import {useEffect} from 'react';

export type JustFocus = {
  focus: () => void;
  blur?: () => void;
};

export type JustBlur = {
  blur: () => void;
  focus?: () => void;
};

export type UseTabFocusParams = JustFocus | JustBlur;

export default function useTabFocus(params: UseTabFocusParams) {
  const {blur, focus} = params;

  useEffect(() => {
    focus && window.addEventListener('focus', focus);
    blur && window.addEventListener('blur', blur);

    return () => {
      focus && window.removeEventListener('focus', focus);
      blur && window.removeEventListener('blur', blur);
    };
  }, []);
}
