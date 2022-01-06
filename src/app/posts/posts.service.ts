import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http.get<any>('http://localhost:3000/api/posts')
      // Accepts an operator to modify the data. In this case, we are returning the same object essentially, but renaming the _id from the database to be id, matching the model we created on the front-end.
      .pipe(map(postData => {
        return postData.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((posts) => {
        this.posts = posts;
        this.postsUpdated.next([...this.posts])
      });

  }

  // Returns an object that we emit so that it can be listened for
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string}>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        console.log(res.message);
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      })
  }
}
