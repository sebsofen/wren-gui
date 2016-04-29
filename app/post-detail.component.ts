import {Component,  OnInit}  from 'angular2/core';
import {PostMetadata, Post, PostAsm, BlogService}   from './blog.service';
import {RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';

@Component({
  templateUrl: 'tmpl/post.html',
  bindings: [MarkdownService]
})

export class PostDetailComponent implements OnInit{
  post: PostAsm;
  private md: MarkdownService;

  constructor (
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService,
    private _md : MarkdownService
  ){
    this.md = _md;
  }

 ngOnInit() {
   let slug = this._routeParams.get('slug');
   this._service.getPostBySlug(slug).subscribe(f => this.post = f);


 }

 toMarkdown(content: string) : string {
   return this.md.convert(content);
 }

long2date(longdate: number): string {
    var time = new Date().getTime();
    var date = new Date(longdate * 1000);
    return date.toString();
  }

}
