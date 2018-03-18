import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { forIn } from 'lodash';

import { APIS, API_KEY } from 'Config';
import { RequestHelper } from 'AppHelpers';

@Injectable()
export class LcUploadService {
  progress;
  progressObserver;
  constructor(private requestHelper: RequestHelper) {
    this.progress = Observable.create(observer => {
        this.progressObserver = observer;
    }).share();
  }

  getSignature(folderIdentifier: string): Observable<any> {
    return this.requestHelper.makeGenericGetRequest(
        APIS.CLOUDINARY_SIGNATURE,
        {params : {folder_identifier: folderIdentifier}}
      );
  }

  uploadFile(file: File, config: any): Observable<any> {
    return Observable.create(observer => {
      let formData: FormData, xhr: XMLHttpRequest;
      config.api_key = API_KEY;
      formData       = new FormData();
      xhr            = new XMLHttpRequest();
      formData.append('file', file, file.name);
      forIn(config, (value, key): void => formData.append(key, value));
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            observer.next(JSON.parse(xhr.response));
            observer.complete();
          } else {
            observer.error(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        this.progress = Math.round(event.loaded / event.total * 100);
        // this.progressObserver.next(this.progress);
      };

      xhr.open('POST', APIS.CLOUDINARY_API, true);
      xhr.send(formData);
    });
  }
}
