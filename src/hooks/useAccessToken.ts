import {useAppSelector} from '@forest-feed/hooks/redux';
import {selectAccessToken} from '@forest-feed/redux/selectors';

const useAccessToken = () => useAppSelector(selectAccessToken);

export default useAccessToken;
