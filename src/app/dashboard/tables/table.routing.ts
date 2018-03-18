
import { SettingsComponent }     from './settings/settings.component';
import { TableManagerComponent } from './tables-manager/table-manager.component';

export const STATES: any = [
  {
    url:       '/tables-manager',
    component: TableManagerComponent,
    name:      'Dashboard.Tables.TablesManager'
  },
  {
    url:       '/settings',
    component: SettingsComponent,
    name:      'Dashboard.Tables.Settings'
  }
];
