import {Spacer} from './Spacer';

export type TextAreaProps = {
  label: string;
  value: string;
  placeholder?: string;
};

export function TextArea(props: TextAreaProps) {
  const {label, value, placeholder} = props;
  return (
    <div className="flex flex-col items-start">
      <label htmlFor={label} className="text-xl font-bold">
        {label}
      </label>

      <textarea
        id={label}
        placeholder={placeholder}
        className="border border-border w-[100%] h-[157px] p-3 rounded-lg font-normal text-lg"
        value={value}
      />
      <Spacer times={2} />
    </div>
  );
}
