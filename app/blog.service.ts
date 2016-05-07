import {Injectable} from 'angular2/core';
import { Http, Response, Headers } from 'angular2/http';
import {Configuration} from './app.configuration';
import 'rxjs/Rx';

export class PostMetadata {
  constructor(public title: string, public created: number, public tags: string[], public slug: string) { }
}

export class Post {
  constructor(public content: string) { }
}

export class PostAsm {
  constructor(public metadata: PostMetadata, public post: Post) { }
}

export class BlogMetaInfo {
  constructor(public tags: string[], public start : Number, public stop: Number, public postCount : Number) { }
}


@Injectable()
export class BlogService {
  private cfg : Configuration;

  constructor(private _http: Http, private _configuration:Configuration) {
    this.cfg = _configuration;
  }


  getPostBySlug(slug: string) {
    return this._http.get(this.cfg.Server + "posts/by-slug/"  + slug).map(res => <PostAsm>res.json())
  }

  getBlogMetaInfo(start: Number = -1, stop: Number = Number.MAX_VALUE) {
    return this._http.get(this.cfg.Server + "blog/metainfo?start=" + start + "&stop=" + stop ).map(res => <BlogMetaInfo>res.json())
  }

  getPosts(limit: string = "10", offset: string = "0", order: string ="bydate", sort : string = "desc") {
    return this._http.get(this.cfg.Server + "posts?limit=" + (limit || "10")  + "&offset=" + (offset || "0") + "&order=" + (order || "bydate") + "&sort=" + (sort || "desc")   ).map(res => <PostAsm[]>res.json())
  }
  
}
