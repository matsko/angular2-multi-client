import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';

import {bootstrap} from './lib/electron-plugin/main';
import {MyApp} from './app/my-app';

bootstrap(MyApp);
