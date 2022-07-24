import { Item } from '../handlers/types';

export const validation = (
  title: string,
  description: string,
  price: number,
  imgUrl: string,
  count: number
): Omit<Item, 'id'> | Error => {
  if (title === undefined) {
    return new Error('Title is required');
  } else if (description && typeof description !== 'string') {
    return new Error('Description should be a string');
  } else if (price && (typeof price !== 'number' || price < 0)) {
    return new Error('Price should be a positive number');
  } else if (imgUrl && typeof imgUrl !== 'string') {
    return new Error('imgurl should be a string');
  } else if (
    count &&
    (typeof count !== 'number' || !Number.isInteger(count) || count < 0)
  ) {
    return new Error('Count should be a positive integer number');
  }

  return {
    title,
    description: description || '',
    price: +price || 0,
    imgUrl:
      imgUrl ||
      'https://images.ctfassets.net/x7j9qwvpvr5s/6x3Oc0cYWlCyTQD2DOfjwG/76e89b4aaf11166f772f3ea92ae1d67d/Model-Menu-MY21-MON-937-R-v03.png',
    count: +count || 0,
  };
};
