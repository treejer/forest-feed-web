import {useAppSelector} from '@forest-feed/hooks/redux';
import {selectConfig} from '@forest-feed/redux/selectors';

const useConfig = () => useAppSelector(selectConfig);

export default useConfig;
