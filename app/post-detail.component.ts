/// <reference path="../typings/leaflet/leaflet.d.ts"/>

import {Component,  OnInit, ViewChild,ElementRef}  from 'angular2/core';
import {PostMetadata, Post, PostAsm, BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {Map, TileLayer} from 'leaflet';
import { Http, Response, Headers } from 'angular2/http';

export class GeoFile {
  constructor(public path: string, public name: string) { }
}


@Component({
  templateUrl: 'tmpl/post.html',
  bindings: [MarkdownService],
  directives: [ROUTER_DIRECTIVES],

})
export class PostDetailComponent implements OnInit{
  post: PostAsm;
  geofiles: GeoFile[] = [];
  private md: MarkdownService;
  mymap: Map;
  showmap: Boolean = true;
  @ViewChild('map') mapcanvas:ElementRef;
  geoJson;


  constructor (
    private _http: Http,
     private _router:Router,
     private _routeParams:RouteParams,
     private _service:BlogService,
    private _md : MarkdownService
  ){
    this.md = _md;


  }

 ngOnInit() {

   let slug = this._routeParams.get('slug');
   this._service.getPostBySlug(slug).subscribe(f => {
     this.post = f
     //find map tag
     var myRegexp = /\[map file=\"(.*)\" (.*)\]/g;
     var match = myRegexp.exec(this.post.post.content);
     if (match) {

     console.log(match[1]);
     this.post.post.content = this.post.post.content.replace(match[0],"");
     this.geofiles.push(new GeoFile("http://localhost:9000/v1/trailmagic/static/" + this.post.metadata.slug + "/" + match[1], match[2]));
     console.log(this.geofiles);

     this._http.get("http://localhost:9000/v1/trailmagic/static/" + this.post.metadata.slug + "/" + match[1]).subscribe(k => {
       var group = L.geoJson(k.json());
       group.addTo(this.mymap);
       this.mymap.fitBounds(group.getBounds());

     });

   }else{
     this.showmap = false;
   }
   });




 }
 ngAfterViewInit() {
     this.mymap =  L.map(this.mapcanvas.nativeElement).setView([51.505, -0.09], 13);
    L.tileLayer("http://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18,
    }).addTo(this.mymap);


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
