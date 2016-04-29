import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {PostDetailComponent} from './post-detail.component';
import {PostListComponent} from './post-list.component';
import {BlogService} from './blog.service';
import {Configuration} from './app.configuration';


@Component({
    selector: 'my-app',
    template: `<h1> </h1>

    <router-outlet></router-outlet>`,
    providers:[BlogService,Configuration],
    directives: [ROUTER_DIRECTIVES]
})

@RouteConfig([
  {path:'/post/by-slug/:slug',      name: 'PostDetailComponent',   component: PostDetailComponent},
  {path:'/post/list',      name: 'PostListComponent',   component: PostListComponent}
])

export class AppComponent { }
