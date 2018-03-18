import { ProviderComponent } from './provider/provider.component';

export const STATES: any = [
  {path: '/stripe',     name: 'Stripe',     component: ProviderComponent},
  {path: '/twitter',    name: 'Twitter',    component: ProviderComponent},
  {path: '/facebook',   name: 'Facebook',   component: ProviderComponent},
  {path: '/instagram',  name: 'Instagram',  component: ProviderComponent},
  {path: '/foursquare', name: 'Foursquare', component: ProviderComponent}
];
