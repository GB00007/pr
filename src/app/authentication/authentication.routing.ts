import { LoginComponent }          from './login/login.component';
import { RegisterComponent }       from './register/register.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

export const STATES: any = [
  {url: '/login',    name: 'Authentication.Login',    component: LoginComponent},
  {url: '/register', name: 'Authentication.Register', component: RegisterComponent},
  {
    url: '/forget-password',
    name: 'Authentication.ForgetPassword',
    component: ForgetPasswordComponent
  }
];
