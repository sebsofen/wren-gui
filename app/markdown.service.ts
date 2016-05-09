import { Injectable } from 'angular2/core';
import marked from 'marked';
import {Configuration} from './app.configuration';


interface IMarkdownConfig {
  sanitize?: boolean,
  gfm?: boolean,
  breaks?: boolean,
  smartypants?: boolean
}

@Injectable()
export class MarkdownService {
  private md: MarkedStatic;
  private cfg: Configuration;

  constructor(private _configuration:Configuration) {
    this.md = marked.setOptions({});
    this.cfg = _configuration;
  }

  setConfig(config: IMarkdownConfig) {
   this.md = marked.setOptions(config);
  }

  convert(markdown: string): string {
    if(!markdown) {
      return '';
    }

    //try to parse footnotes first:
    var regex = /(\[footnote:([^\]]*)])/g;
    var m;
    var markneu = markdown;
    var i = 0;
    do {
      m = regex.exec(markdown);
      if (m) {
        i++;
        console.log(m[1], m[2]);
        markneu = markneu.replace(m[1],"[" + i + "]");
        markneu += "\n\n\n[" + i + "]" + m[2];

      }
    } while (m);
    var renderer = new this.md.Renderer();
    let statfileserv = this.cfg.StaticFilesServer;
    console.log(statfileserv);
    renderer.image = function(href, title, text) {
      var out = '<img src="' + statfileserv + "/" +  href + '" alt="' + text + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += this.options.xhtml ? '/>' : '>';
      return out;
    };


    return this.md(markneu, { renderer: renderer });
  }



}
