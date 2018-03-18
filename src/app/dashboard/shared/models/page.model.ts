import { PagePicture } from './picture.model';

export interface Page {
  name:              string;
  description:       string;
  official_currency: string;
  advanced:          boolean;
  pictures:          PagePicture[];
}
