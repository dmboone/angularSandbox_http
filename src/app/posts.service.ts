import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Post } from "./post.model";
import { map, catchError, tap } from 'rxjs/operators';
import { Subject, throwError } from "rxjs";

@Injectable({providedIn: 'root'}) // could also provide in providers array in app.module but this is more modern approach
export class PostsService{
    error = new Subject<string>();

    constructor(private http: HttpClient){}

    createAndStorePost(title: string, content: string){
        const postData: Post = {title: title, content: content};

        // Send Http request - angular will automatically convert our postData to json for us, which is what you normally provide in an http request (json, not a js/ts object!)
        this.http.post<{name: string}>(
          'https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json', 
          postData,
          {
            observe: 'response' // can observe response instead of default which is body
          }
          )
        .subscribe(responseData => { // need to subscribe and get the response in order for the http request to even send in the first place; if you do not subscribe, the http request will not get sent! do not need to unsubscribe
        console.log(responseData);
        }, error => {
            this.error.next(error.message); // using a Subject to emit event (error message) data using next
        });
    }

    fetchPosts(){
        let searchParams = new HttpParams(); // creating http params
        searchParams = searchParams.append('print', 'pretty'); // this prints the response in a nice way
        searchParams = searchParams.append('custom', 'key');

        return this.http.get<{[key: string]: Post}>('https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json',
          {
            headers: new HttpHeaders({'Custom-Header': 'Hello'}), // can pass custom headers
            params: searchParams // can set params here as well
          }
        ) // we return this observable
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
          ),
          catchError(errorRes => { // can also catch errors here
            return throwError(errorRes);
          })
        );
    }

    deletePosts(){
        return this.http.delete('https://angularsandboxhttp-default-rtdb.firebaseio.com/posts.json',
        {
          observe: 'events'
        }
        ).pipe(tap(event=>{
          console.log(event);
          if(event.type === HttpEventType.Response){ // checks if the event is indeed the response object (should be number 4)
            console.log(event.body);
          }
        }));
    }
}