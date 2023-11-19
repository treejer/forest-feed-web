import {useAppSelector} from '@forest-feed/hooks/redux';
import {selectRegularSaleContract} from '@forest-feed/redux/selectors';

const useRegularSaleContract = () => useAppSelector(selectRegularSaleContract);

export default useRegularSaleContract;
