import { Injectable } from '@angular/core';


@Injectable()
export class Configuration {
  public Server: string = "http://localhost:9000/v1/sandbox/"
  public PostBySlug: string = "posts/by-slug/"
  public AuthorsList: string = "authors"
  public Paginate_PostsPerPage: number = 5
  public StaticFilesServer : string = "http://localhost:9000/v1/sandbox/static/"
}
