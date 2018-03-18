import { Printer } from './printer.model';

export interface ItemType {
  id?:              string;
  page?:            string;
  name?:            string;
  nameTranslation?: TranslationObject;
  descriptionTranslation?: TranslationObject;
  isPrintEnabled?:  boolean;
  isInDigitalMode?: boolean;
  printers?:        Printer[];
}

export interface TranslationObject {
  language_code?: number;
  name?: string;
}
