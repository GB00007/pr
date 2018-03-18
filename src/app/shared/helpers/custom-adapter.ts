// https://plnkr.co/edit/FlgGpjqyDlypas0VZJzo?p=preview
// TODO(mmalerba): Remove when we no longer support safari 9.
/** Whether the browser supports the Intl API. */
import { NativeDateAdapter } from '@angular/material';
/** Adapts the native JS Date for use with cdk-based
 * components that work with dates. */
export class CustomAdapter extends NativeDateAdapter {
  parse(value: any): Date | null {
    // We have no way using the native JS Date to set the
    // parse format or locale, so we ignore these
    // parameters.
    if ((typeof value === 'string') && (value.indexOf('/') > -1)) {
      value = value.split('/').reverse().join('-');
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }
}

