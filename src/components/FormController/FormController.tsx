import React, {useCallback} from 'react';

import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseFormStateReturn,
} from 'react-hook-form';

import {TextArea} from '@forest-feed/components/kit/TextArea';
import {ErrorMessage} from '@forest-feed/components/FormController/ErrorMessage';
import {Uploader} from '@forest-feed/components/kit/Uploader';
import {Checkbox} from '@forest-feed/components/kit/Icons/Checkbox/Checkbox';
import {RenderIf} from '@forest-feed/components/common/RenderIf';
import {Spacer} from '@forest-feed/components/common/Spacer';

export type FormControllerRender = {
  field: ControllerRenderProps<FieldValues, string>;
  fieldState: ControllerFieldState;
  formState: UseFormStateReturn<FieldValues>;
};

export type FormControllerProps<ElType = HTMLInputElement> = {
  control: Control<any>;
  name: string;
  placeholder?: string;
  type: 'textarea' | 'file' | 'checkbox';
  label?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<ElType>, field: Omit<FormControllerRender, 'formState'>) => void;
  onBlur?: (field: Omit<FormControllerRender, 'formState'>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>, field: Omit<FormControllerRender, 'formState'>) => void;
  preview?: boolean;
  hideLabel?: boolean;
};

export function FormController<ElType = HTMLInputElement>(props: FormControllerProps<ElType>) {
  const {control, type, label, hideLabel, name, placeholder, disabled, preview, onChange, onBlur, onDrop} = props;

  const handleChange = useCallback(
    (e, {field, fieldState}: Omit<FormControllerRender, 'formState'>) => {
      if (onChange) return onChange(e, {field, fieldState});
      field.onChange(e);
    },
    [onChange],
  );

  const handleBlur = useCallback(
    ({field, fieldState}: Omit<FormControllerRender, 'formState'>) => {
      if (onBlur) return onBlur({field, fieldState});
      field.onBlur();
    },
    [onBlur],
  );

  const handleRender = useCallback(
    ({field, fieldState}: FormControllerRender) => {
      switch (type) {
        case 'checkbox':
          return (
            <Checkbox
              text={label}
              checked={field.value}
              onChange={e => handleChange(e, {field, fieldState})}
              onBlur={() => handleBlur({field, fieldState})}
              disabled={disabled}
            />
          );
        case 'file':
          return (
            <Uploader
              file={field.value?.[0]}
              preview={preview}
              onChange={e => handleChange(e, {field, fieldState})}
              onDrop={e => onDrop?.(e, {field, fieldState})}
              onBlur={() => handleBlur({field, fieldState})}
              disabled={disabled}
            />
          );
        case 'textarea':
        default:
          return (
            <TextArea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value}
              onChange={e => handleChange(e, {field, fieldState})}
              onBlur={() => handleBlur({field, fieldState})}
            />
          );
      }
    },
    [type, preview, placeholder, disabled, handleChange, onDrop, handleBlur],
  );

  return (
    <div>
      <RenderIf condition={!hideLabel}>
        <label htmlFor={name} className="text-xl font-bold">
          {label}
        </label>
      </RenderIf>
      <Controller
        control={control}
        render={field => (
          <>
            {handleRender(field)}
            <Spacer />
            <ErrorMessage
              name={name}
              isSubmitted={field.formState.isSubmitted}
              touched={field?.fieldState.isTouched}
              error={field?.fieldState?.error?.message}
            />
          </>
        )}
        name={name}
      />
    </div>
  );
}
