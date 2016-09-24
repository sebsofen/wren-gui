import {Component,  OnInit}  from 'angular2/core';
import {PostMetadata, Post, Author, PostAsm, BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {Configuration} from './app.configuration';
import {Injectable} from 'angular2/core';
import { Pipe, PipeTransform } from '@angular/core';

import {PostDetailComponent} from './post-detail.component';

@Pipe({name: 'identity'})
export class IdentityPipe implements PipeTransform {
  transform(objj: {[id: string] : Author}, args: string): Author {
    if(objj != null){
  return objj[args];  
    }

  }
}

@Component({
  template: require('to-string!../tmpl/postlist.html'),
  pipes: [IdentityPipe],
  bindings: [MarkdownService],
  directives: [ROUTER_DIRECTIVES],
})

@Injectable()
export class PostListComponent implements OnInit{
  postlist: PostAsm[];
  limit: string;
  order: string;
  offset: string;
  sort: string;
  page: number;
postsPerPage :number;

  authors = this._service.getAuthorsList().map(f => f.reduce(function(map, obj) {
    map[obj.id] = obj;
    return map;
}, {}))

  private md: MarkdownService;

  page_total: number;
  page_current: number;
  filter: string;
  private cfg : Configuration;

  constructor (
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService,
      private _configuration:Configuration,
      private _md : MarkdownService
  ){
      this.cfg = _configuration;
      this.md = _md;
      this.postsPerPage = this.cfg.Paginate_PostsPerPage;
  }

 ngOnInit() {
   this.limit = this._routeParams.get('limit');
   this.order = this._routeParams.get('order');
   this.offset = this._routeParams.get('offset');
   this.sort = this._routeParams.get('sort');
   this.page = parseInt(this._routeParams.get('page') || "0");
   this.filter = this._routeParams.get('filter') || "nofilter";

   this._service.getBlogMetaInfo().subscribe(metaInfo => {
    //total post count:
    let totPosts = metaInfo.postCount;

    if(this.filter.startsWith("nofilter")){
      this._service.getPosts(this.postsPerPage,this.page * this.postsPerPage,this.order,this.sort).subscribe(f => this.postlist = f);
    }else if (this.filter.startsWith("tags:")){
      var tags = this.filter.split(":")[1];
      this._service.getPostsByTags(this.postsPerPage,this.page * this.postsPerPage,this.order,this.sort,tags).subscribe(f => this.postlist = f);
    }


    this.page_current = this.page;
    this.page_total = Math.floor(totPosts / this.postsPerPage) - 1;

    //update paginator!
   });


 }

  searchPosts(searchstr: string) {
    this._service.getPostsBySearchString(this.postsPerPage,this.page * this.postsPerPage,this.order,this.sort,searchstr).subscribe(f => this.postlist = f);
  }

  toMarkdown(content: string) : string {
    return this.md.convert(content);
  }

  long2date(longdate: number): string {
    var time = new Date().getTime();
    var date = new Date(longdate * 1000);
    return date.toDateString();
  }

  getImageForAuthor(author: string) {
    return  this._service.getAuthorByName(author).map(g => g.img).toPromise();


  }

}
