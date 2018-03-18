import { Color } from './color.model';

export interface Status {
  isFirstOpen: boolean;
  isFirstDisabled: boolean;
}

export interface Sector {
  id: string;
  name: string;
}

export interface CategoryTranslation {
  name:          string;
  language_code: string;
}

export interface Category extends Sector {
  color?:           Color;
  total_items?:     number;
  is_archive?:      boolean;
  is_favorite?:     boolean;
  items_has_pic?:   boolean;
  activate_portal?: boolean;
  translation?:     CategoryTranslation;
}

export type BusinessSector = Sector;
