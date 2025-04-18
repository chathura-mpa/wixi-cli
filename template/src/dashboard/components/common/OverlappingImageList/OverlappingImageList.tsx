import React from 'react';
import { Text } from '@wix/design-system'
import classes from './OverlappingImageList.module.scss'
import { products } from '@wix/stores';

const MAX_VISIBLE = 5;


interface OverlappingImageListProps {
  products: products.Product[];
}

const OverlappingImageList: React.FC<OverlappingImageListProps> = ({ products }) => {

  const images = products.map((product) => product.media?.mainMedia.image.url);
  const visibleImages = images.slice(0, MAX_VISIBLE);
  const remainingCount = images.length - MAX_VISIBLE;

  return (
    <div className={classes.imageList}>
      {visibleImages.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`img-${index}`}
          className={classes.overlapImage}
        />
      ))}

      {remainingCount > 0 && (
        <Text size='tiny' weight='normal' className={`${classes.numberContainer} ${classes.extraCount}`}>
          +{remainingCount}
        </Text>
      )}
    </div>
  );
};

export default OverlappingImageList;