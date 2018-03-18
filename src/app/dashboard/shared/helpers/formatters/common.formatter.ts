import { Injectable }  from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { map, omit, chain, groupBy, mapValues } from 'lodash';

@Injectable()
export class CommonFormatter {
  public static formatReductions(reduction: any): any {
    reduction.amount = +(new DecimalPipe(navigator.language).transform(reduction.amount, '1.2-2'));
    return reduction;
  }

  public static formatSocialProviders(socialProviders: any[], fieldName: string): any {
    return chain(socialProviders).groupBy(fieldName)
                                 .mapValues((value: any): any => omit(value[0], fieldName))
                                 .value();
  }

  // tslint:disable-next-line:max-line-length
  public static formatPictureUrl(picture: any, cropped: boolean, composed: boolean, mini?: boolean): string {
    if (!picture) {
      return null;
  }
    const path:   string[] = [];
    const params: string[] = [];
    if (cropped && picture.extraSettings.height && picture.extraSettings.width) {
      params.push(`h_${picture.extraSettings.height}`);
      params.push(`w_${picture.extraSettings.width}`);
      params.push(`x_${picture.extraSettings.x}`);
      params.push(`y_${picture.extraSettings.y}`);
    }
    path.push(picture.base_url);
    if (params.length) {
      params.unshift('/c_crop');
      path.push(params.join(','));
    } else {
      if (mini) {
        path.push('/w_250,h_150,c_lfill');
      }
    }
    if (composed) {
      path.push('/w_70,h_65,c_lfill');
    }
    path.push('/');
    path.push(picture.path);
    return path.join('');
  }
}
