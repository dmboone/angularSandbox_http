import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts: Post[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request - angular will automatically convert our postData to json for us, which is what you normally provide in an http request (json, not a js/ts object!)
    this.http.post<{name: string}>('https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json', postData)
      .subscribe(responseData => { // need to subscribe and get the response in order for the http request to even send in the first place; if you do not subscribe, the http request will not get sent! do not need to unsubscribe
        console.log(responseData);
      });
  }

  onFetchPosts() {
    // Send Http request
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts(){
    this.http.get<{[key: string]: Post}>('https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json')
      .pipe( // we want to preprocess/transform the data so that the subscribe receives the cleaned up array of posts instead of the firebase object with the cryptic key
        map(responseData => { // grabs response from http request which is a firebase object
          const postsArray: Post[] = [];
          for(const key in responseData){ // will go through each firebase object, which is labeled with a cryptic key
            if(responseData.hasOwnProperty(key)){ // good practice to do this to make sure you are not accessing the property of a prototype but technically not required
              postsArray.push( 
                { // accessing the nested javascript object with the actual title and content data attached to the cryptic key
                  ...responseData[key], // the spread operator (...) will pull out all the nested key value pairs (title and content) and store them individually in this new object we are creating 
                  id: key // also store the cryptic key as a unique id in this object so that we can access this content again in the database (like if we call get or patch perhaps and need to identify a specific post)!
                }
              ); // finally push this newly created object onto our postsArray                                                   
            }
          }
          return postsArray; // this is now what subscribe will receive down below!
        }
        )
      )
      .subscribe(posts => {
        this.loadedPosts = posts;
      });
  }
}
