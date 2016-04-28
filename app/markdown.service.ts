import { Injectable } from 'angular2/core';
import marked from 'marked';

interface IMarkdownConfig {
  sanitize?: boolean,
  gfm?: boolean,
  breaks?: boolean,
  smartypants?: boolean
}

@Injectable()
export class MarkdownService {
  private md: MarkedStatic;

  constructor() {
    this.md = marked.setOptions({});
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
    return this.md.parse(markneu);
  }



}
