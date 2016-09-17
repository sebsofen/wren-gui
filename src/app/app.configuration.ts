import { Injectable } from '@angular/core';


@Injectable()
export class Configuration {
  public Server: string = "http://trailmagic.de/v1/trailmagic/"
  public PostBySlug: string = "posts/by-slug/"
  public Paginate_PostsPerPage: number = 5
  public StaticFilesServer : string = "http://trailmagic.de/v1/trailmagic/static/"
}
