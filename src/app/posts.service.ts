import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from "rxjs/operators";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title: title, content: content };
    return this.http
      .post<{ name: string }>(
        "https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/posts.json",
        postData,
        {
          // demonstrate how to use observe to get more than 'body' (which is default)
          observe: 'response'
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData.body);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPosts() {
    // demo how to send multiple params
    let searchParams = new HttpParams();
    searchParams = searchParams.append("print", "pretty");
    searchParams = searchParams.append("custom", "key");
    return this.http
      .get<{ [key: string]: Post }>(
        "https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ "Custom-Header": "Hello" }),
          // params: new HttpParams().set('print', 'pretty')
          params: searchParams,
        }
      )
      .pipe(
        map((responseData) => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorResult) => {
          // send to analytics/logger service
          return throwError(errorResult);
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      "https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/posts.json/",
      {
        observe: 'events'
      }
    ).pipe(tap((event) => {
      console.log(event);
      if( event.type === HttpEventType.Response){
        console.log(event.body);
      }
    }));
  }
}
