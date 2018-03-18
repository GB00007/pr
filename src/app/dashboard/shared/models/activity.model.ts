export interface Activity  {
  id:               string;
  name?:            string;
  description?:     string;
  activityPerDay?:  number;
  activityPerHour?: number;
  activityPerWeek?: number;
  isNoRecurring?:   boolean;
  remuneration?:    Remuneration;
}

export interface Remuneration {
  titanium: Coin | number;
  gold:     Coin | number;
  silver:   Coin | number;
  copper:   Coin | number;
}

export interface Coin {
  amount:   number;
  isHidden: boolean;
}
export enum CoinName {
  GOLD     = 'gold',
  COPPER   = 'copper',
  SILVER   = 'silver',
  TITANIUM = 'titanium'
};
