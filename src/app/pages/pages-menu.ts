import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/pages/dashboard',
  },
  {
    title: 'Sensors',
    icon: 'thermometer-outline',
    link: '/pages/node/sensor',
  },
  {
    title: 'Stations',
    icon: 'radio-outline',
    link: '/pages/node/station',
  },
  {
    title: 'Users',
    icon: 'people-outline',
    link: '/pages/users',
  },
  {
    title: 'Roles',
    icon: 'lock-outline',
    link: '/pages/roles',
  },
  {
    title: 'Query',
    icon: 'search-outline',
    link: '/pages/query',
  },
  {
    title: 'Manage',
    icon: 'settings-2-outline',
    link: '/pages/manage',
  },
];
