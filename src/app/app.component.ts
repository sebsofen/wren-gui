/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { RouteConfig, Router } from '@angular/router-deprecated';

import {Configuration} from './app.configuration';
import {BlogService} from './blog.service';
import {PostDetailComponent} from './post-detail.component';
import {PostListComponent} from './post-list.component';


import { AppState } from './app.service';
import { Home } from './home';
import { RouterActive } from './router-active';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [ ],
  encapsulation: ViewEncapsulation.None,
  styles: [
    require('./app.css')
  ],
  template: ` <router-outlet></router-outlet>`,
  providers:[BlogService,Configuration],
  directives: [RouterActive]
})

@RouteConfig([
  {path:'/post/by-slug/:slug',      name: 'PostDetailComponent',   component: PostDetailComponent},
  {path:'/post/list',      name: 'PostListComponent',   component: PostListComponent},
  {path:'',      name: 'PostListComponent',   component: PostListComponent}
])

export class App {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  loading = false;
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  constructor(
    public appState: AppState) {

  }

  ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
