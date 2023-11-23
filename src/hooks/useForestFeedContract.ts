import {useAppSelector} from '@forest-feed/hooks/redux';
import {selectForestFeedContract} from '@forest-feed/redux/selectors';

const useForestFeedContract = () => useAppSelector(selectForestFeedContract);

export default useForestFeedContract;
