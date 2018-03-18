export interface Printer {
  id?:               string;
  page?:             string;
  name?:             string;
  margin?:           string;
  format?:           string;
  language?:         string;
  separator?:        string;
  font_size?:        string;
  font_family?:      string;
  font_weight?:      string;
  line_length?:      number;
  line_spacing?:     string;
  header_character?: string;
  enabled?:          boolean;
}
