import { Picture } from './picture.model';
import { Category } from './category.model';

export interface Item {
  internal_category?: any;
  sizes:              any[];
  result:             any[];
  entries:            any[];
  options?:           any[];
  varieties:          any[];
  extra_configs:      any[];
  id:                 string;
  name:               string;
  order:              number;
  price:              number;
  item_reduction:     number;
  allergies:          Object;
  description:        string;
  official_currency:  string;
  internal_reference: string;
  out_of_stock:       boolean;
  isFavorite?:         boolean;
  category:           Category;
  picture:            Picture[];
}
