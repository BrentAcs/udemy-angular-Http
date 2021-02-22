import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  // Firebase:  https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request
    this.http
      .post(
        "https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/posts.json",
        postData
      )
      .subscribe((responseData) => {
        console.log("onCreatePost: " + responseData);
      });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    this.http
      .get(
        "https://ng-complete-guide-4e0a0-default-rtdb.firebaseio.com/posts.json"
      )
      .subscribe((posts) => {
        console.log("fetchPosts: ");
        console.log(posts);
      });
  }
}
