import Skeleton, {SkeletonTheme} from 'react-loading-skeleton';

export type AssetSkeletonProps = {
  count?: number;
};

export function AssetSkeleton(props: AssetSkeletonProps) {
  const {count = 1} = props;

  return (
    <SkeletonTheme>
      <div>
        {Array.from(Array(count).keys()).map(item => (
          <div key={item} className="flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton width={64} height={30} />
            </div>
            <div className="flex items-center">
              <Skeleton width={32} height={30} />
            </div>
          </div>
        ))}
      </div>
    </SkeletonTheme>
  );
}
