import {Component} from 'angular2/core';
import {Calendar} from './calendar';

@Component({
  selector: 'my-app',
  templateUrl: 'app/my-app.html',
  directives: [Calendar]
})
export class MyApp {
  items = [1,2,3,4,5];
}
