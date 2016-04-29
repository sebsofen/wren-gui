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


@Injectable()
export class BlogService {
  private baseUrl : string;
  private postBySlugUrl : string;

  constructor(private _http: Http, private _configuration:Configuration) {
    this.baseUrl = _configuration.Server;
  }


  getPostBySlug(slug: string) {
    console.log(this.baseUrl + this.postBySlugUrl + slug)
    return this._http.get(this.baseUrl + "/by-slug/"  + slug).map(res => <PostAsm>res.json())
  }

  getPosts(limit: string = "10", offset: string = "0", order: string ="bydate", sort : string = "desc") {
    return this._http.get(this.baseUrl + "?limit=" + (limit || "10")  + "&offset=" + (offset || "0") + "&order=" + (order || "bydate") + "&sort=" + (sort || "desc")   ).map(res => <PostAsm[]>res.json())
  }
}
