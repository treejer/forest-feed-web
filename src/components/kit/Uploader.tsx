import {AttachIcon} from '@forest-feed/components/kit/Icons/AttachIcon';
import {colors} from '../../../colors';
import {Spacer} from '@forest-feed/components/kit/Spacer';
import {DeleteIcon} from './Icons/DeleteIcon';

export type UploaderProps = {
  preview: boolean;
};

export function Uploader(props: UploaderProps) {
  const {preview} = props;
  return (
    <div className="border border-border h-[88px] rounded-lg flex items-center justify-center ">
      {preview ? <DeleteIcon /> : <AttachIcon color={colors.primaryGreen} />}
      <Spacer />
      <p className="text-secondary text-lg font-medium">
        <span className="text-primaryGreen ">{preview ? 'Attached Photo' : 'Add Photo'}</span>
        {preview ? '' : ' drop it right here'}
      </p>
    </div>
  );
}
