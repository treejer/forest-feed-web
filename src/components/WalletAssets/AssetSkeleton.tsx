import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';
import cn from '@forest-feed/utils/tailwind';

export type AssetSkeletonProps = {
  count?: number;
};

export default function AssetSkeleton(props: AssetSkeletonProps) {
  const {count = 1} = props;

  return (
    <SkeletonTheme>
      <div>
        {Array.from(Array(count).keys()).map(item => (
          <div key={item} className={cn('flex items-center justify-between')}>
            <div className={cn('flex items-center')}>
              <Skeleton width={64} height={30} />
            </div>
            <div className={cn('flex items-center')}>
              <Skeleton width={32} height={30} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
