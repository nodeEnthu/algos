import {Component, ViewEncapsulation} from 'angular2/core';
import {
  RouteConfig,
  ROUTER_DIRECTIVES
} from 'angular2/router';

import {HomeComponent} from '../home/home.component';
import {ContactComponent} from '../contact/contact.component';
import {HttpUtil} from '../../core/http.util';
import {Notification} from '../../core/dto';

import {DfsCmp} from '../dfs/dfs';
import {BfsCmp} from '../bfs/bfs';
import {Wqu} from '../weighedQuickUnion/weighedQuickUnion';
import {Graph} from '../../services/graph/graph';
import {RenderGraphPath} from '../../services/renderGraphPath/renderGraphPath';

@Component({
  selector: 'app',
  templateUrl: './components/app/app.component.html',
  styleUrls: ['./components/app/app.component.css'],
  directives: [ROUTER_DIRECTIVES],
  encapsulation: ViewEncapsulation.None,
  providers:[RenderGraphPath]
})
@RouteConfig([
  { path: '/', component: HomeComponent, as: 'Home' },
  { path: '/dfs', component: DfsCmp, as: 'Dfs' },
  { path: '/bfs', component: BfsCmp, as: 'Bfs' },
  { path: '/wqu', component: Wqu, as: 'Wqu' },
  { path: '/contact', component: ContactComponent, as: 'Contact' }
])
export class AppComponent {

  loading: boolean;

  constructor(private httpUtil: HttpUtil) {

    let numReqStarted = 0;
    let numReqCompleted = numReqStarted;

    this.httpUtil.requestNotifier.subscribe((notification: Notification) => {

      if (notification.type === 'start') {
        ++numReqStarted;
      } else if (notification.type === 'complete') {
        ++numReqCompleted;
      }

      this.loading = numReqStarted > numReqCompleted;
    });
  }
}
