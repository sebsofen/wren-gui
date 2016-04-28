import { Injectable } from 'angular2/core';


@Injectable()
export class Configuration {
  public Server: string = "http://localhost:9000/"
  public PostBySlug: string = "posts/by-slug/"
}
