import {Component,  OnInit}  from 'angular2/core';
import {Author,BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {Map, TileLayer} from 'leaflet';
import { Http, Response, Headers } from 'angular2/http';
import {Configuration} from './app.configuration';

@Component({

  template: require('to-string!../tmpl/authorslist.html'),

  bindings: [MarkdownService],
  directives: [ROUTER_DIRECTIVES],

})

export class AuthorsListComponent implements OnInit{
  private cfg : Configuration;
  private md: MarkdownService;
  authorslist : Author[];
  constructor (
    private _http: Http,
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService,
    private _md : MarkdownService,
    private _configuration:Configuration
  ){
    this.md = _md;
    this.cfg = _configuration;
  }

  ngOnInit() {
    //initialisation process
    this._service.getAuthorsList().subscribe(f => this.authorslist = f);
  }


}
