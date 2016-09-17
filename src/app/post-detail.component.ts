import {Component,  OnInit, ViewChild,ElementRef}  from 'angular2/core';
import {PostMetadata, Post, PostAsm, BlogService}   from './blog.service';
import {ROUTER_DIRECTIVES,RouteConfig,RouteParams, Router} from 'angular2/router';
import {MarkdownService} from './markdown.service';
import {Map, TileLayer} from 'leaflet';
import { Http, Response, Headers } from 'angular2/http';
import {Configuration} from './app.configuration';

export class GeoFile {
  constructor(public path: string, public name: string) { }
}


@Component({

  template: require('to-string!../tmpl/post.html'),

  bindings: [MarkdownService],
  directives: [ROUTER_DIRECTIVES],

})
export class PostDetailComponent implements OnInit{
  post: PostAsm;
  private cfg : Configuration;

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
    private _md : MarkdownService,
    private _configuration:Configuration
  ){
    this.md = _md;
    this.cfg = _configuration;



  }

 ngOnInit() {

   let slug = this._routeParams.get('slug');
   this._service.getPostBySlug(slug).subscribe(f => {
     this.post = f
     this.post.post.content = this.post.post.content.replace(/~/g, this.post.metadata.slug);
     //find map tag
     var myRegexp = /\[map file=\"(.*)\" *(.*) *([^=^ .]+) *\]/g;

     var mapNoShow = true;
     this.showmap = false;

     var tmpPostContent = this.post.post.content
     var match = myRegexp.exec(this.post.post.content);



     while (match != null) {
       this.showmap = true;
       tmpPostContent = tmpPostContent.replace(match[0],"");
       var cmds = match[2].split(" ");
              console.log(cmds);
              var SPLITBY = "";
              for (var i in cmds) {
                var cmd = cmds[i];
                console.log("cmd " + cmd)
                if (cmd.startsWith("splitby=")){
                  SPLITBY = cmd.replace("splitby=","");
                }
              }


       this.geofiles.push(new GeoFile(this.cfg.StaticFilesServer + this.post.metadata.slug + "/" + match[1], match[3]));
       console.log(this.geofiles);

       var mmap = this.mymap;

       this._http.get(this.cfg.StaticFilesServer + this.post.metadata.slug + "/" + match[1]).subscribe(
         k => {

         var group = L.geoJson(k.json(), {
           onEachFeature : function(feature,layer) {
            switch (SPLITBY) {
              case "day":
                if(feature.geometry.type == "LineString"){
                  //perform split by date
                  var savedTs = 0;
                  var daycount = 1;
                  for (var _i = 0; _i < feature.properties.coordTimes.length; _i++){
                    var curTs = new Date(feature.properties.coordTimes[_i]).getTime();
                    if(savedTs + 3600 * 24 * 1000 < curTs){
                      console.log("New marker");
                      savedTs = curTs;
                      //create popup
                      var daysplitlocation = feature.geometry.coordinates[_i];
                      console.log(daysplitlocation)
                     L.marker([daysplitlocation[1], daysplitlocation[0]], {
                       icon: new L.DivIcon({
                         className: 'leaflet-div-icon',
                         html: '<div class="leaflet-div-icon" style="width:50px;">Tag ' + daycount + '</div>'
                       })
                     }).addTo(mmap);

                      daycount += 1;
                    }
                  }
                  console.log(feature.properties.coordTimes)
                  console.log(feature.geometry.coordinates)
                }
              break;
            }


           }
         });


         group.addTo(this.mymap);
         this.mymap.fitBounds(group.getBounds());

       });

       match = myRegexp.exec(this.post.post.content);
     }

     this.post.post.content = tmpPostContent;

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
