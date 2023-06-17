import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppDispatch, AppState} from '@forest-feed/redux/store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
