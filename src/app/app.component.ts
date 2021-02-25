import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs";

import { Post } from "./post.model";
import { PostsService } from "./posts.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  // Firebase:  https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/
  // Original Firebase Rules:
  //   {
  //   "rules": {
  //     ".read": "now < 1616472000000",  // 2021-3-23
  //     ".write": "now < 1616472000000",  // 2021-3-23
  //   }
  // }

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub = this.postsService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.onFetchPosts();
  }

  ngOnDestroy(): void {
    this.errorSub.unsubscribe();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    this.postsService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(
      (posts) => {
        this.isFetching = false;
        console.log("fetchPosts: ");
        console.log(posts);
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.error.error;
        console.log(error);
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.postsService.deletePosts().subscribe((data) => {
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }
}
