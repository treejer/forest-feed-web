import {useAppSelector} from '@forest-feed/hooks/redux';
import {selectDaiTokenContract} from '@forest-feed/redux/selectors';

const useDaiTokenContract = () => useAppSelector(selectDaiTokenContract);

export default useDaiTokenContract;
