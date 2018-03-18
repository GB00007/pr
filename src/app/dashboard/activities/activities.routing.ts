import { OnlineComponent }  from './online/online.component';
import { OfflineComponent } from './offline/offline.component';

export const STATES: any = [
  {url: '/online',  name: 'Dashboard.Activities.Online',  component: OnlineComponent},
  {url: '/offline', name: 'Dashboard.Activities.Offline', component: OfflineComponent}
];
