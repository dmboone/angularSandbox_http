import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  onCreatePost(postData: { title: string; content: string }) {
    // Send Http request - angular will automatically convert our postData to json for us, which is what you normally provide in an http request (json, not a js/ts object!)
    this.http.post('https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json', postData)
      .subscribe(responseData => { // need to subscribe and get the response in order for the http request to even send in the first place; if you do not subscribe, the http request will not get sent! do not need to unsubscribe
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
  }

  onClearPosts() {
    // Send Http request
  }
}
