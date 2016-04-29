import {Component,  OnInit}  from 'angular2/core';
import {PostMetadata, Post, PostAsm, BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {PostDetailComponent} from './post-detail.component';
@Component({
  templateUrl: 'tmpl/postlist.html',
   directives: [ROUTER_DIRECTIVES],
})

export class PostListComponent implements OnInit{
  postlist: PostAsm[];

  constructor (
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService
  ){

  }

 ngOnInit() {
   let limit = this._routeParams.get('limit');
   let order = this._routeParams.get('order');
   let offset = this._routeParams.get('offset');
   let sort = this._routeParams.get('sort');

   this._service.getPosts(limit,offset,order,sort).subscribe(f => this.postlist = f);
 }



long2date(longdate: number): string {
    var time = new Date().getTime();
    var date = new Date(longdate * 1000);
    return date.toString();
  }

}
