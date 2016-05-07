import {Component,  OnInit}  from 'angular2/core';
import {PostMetadata, Post, PostAsm, BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {Configuration} from './app.configuration';
import {Injectable} from 'angular2/core';

import {PostDetailComponent} from './post-detail.component';
@Component({
  templateUrl: 'tmpl/postlist.html',
   directives: [ROUTER_DIRECTIVES],
})

@Injectable()
export class PostListComponent implements OnInit{
  postlist: PostAsm[];
  page_total: number;
  page_current: number;
  private cfg : Configuration;

  constructor (
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService,
      private _configuration:Configuration
  ){
      this.cfg = _configuration;
  }

 ngOnInit() {
   let limit = this._routeParams.get('limit');
   let order = this._routeParams.get('order');
   let offset = this._routeParams.get('offset');
   let sort = this._routeParams.get('sort');
   let page = parseInt(this._routeParams.get('page') || "1");

   this._service.getBlogMetaInfo().subscribe(metaInfo => {
    //total post count:
    let totPosts = metaInfo.postCount;
    let postsPerPage = this.cfg.Paginate_PostsPerPage;
    this._service.getPosts(postsPerPage,page * postsPerPage,order,sort).subscribe(f => this.postlist = f);
    this.page_current = page;
    this.page_total = Math.floor(totPosts / postsPerPage) - 1;

    //update paginator!
   });


 }



long2date(longdate: number): string {
    var time = new Date().getTime();
    var date = new Date(longdate * 1000);
    return date.toString();
  }

}
