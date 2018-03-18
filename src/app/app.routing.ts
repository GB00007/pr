import { AppComponent }            from './app.component';
import { DownloadComponent }       from './download/download.component';
import { DashboardComponent }      from './dashboard/dashboard.component';
import { SocialLinkComponent }     from './social-link/social-link.component';
import { ValidateEmailComponent }  from './validate-email/validate-email.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { PageNotFoundComponent }   from './page-not-found/page-not-found.component';

export const STATES: any = [
  {url: '/d',                    name: 'Download',      component: DownloadComponent},
  {url: '/social-link',          name: 'SocialLink',    component: SocialLinkComponent},
  {url: '/validate/email/:code', name: 'ValidateEmail', component: ValidateEmailComponent},
  {
    url:        '/',
    name:       'Home',
    component:  AppComponent,
    redirectTo: 'Authentication.Login'
  },
  {
    name:       'Dashboard',
    url:        '/dashboard',
    component:  DashboardComponent,
    redirectTo: 'Dashboard.LoyaltyModule.Socials'
  },
  {
    name:       'Authentication',
    url:        '/authentication',
    redirectTo: 'Authentication.Login',
    component:  AuthenticationComponent
  },
  {
    name:      'PageNotFound',
    url:       '/page-not-found',
    component: PageNotFoundComponent
  }
];
