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

  getPost(id: string) {
    return this.http.get<{_id: string, title: string, content: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    this.http.post<{message: string, postId: string}>('http://localhost:3000/api/posts', post)
      .subscribe((res) => {
        // Add the returned post ID to the post so that the DOM actually have an ID for the post without reloading..
        post.id = res.postId;
        // Add the post to the post list.
        this.posts.push(post);
        // Update the DOM with the updated post list
        this.postsUpdated.next([...this.posts]);
      })
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = {id: id, title: title, content: content};
    this.http.put(`http://localhost:3000/api/posts/${id}`, post)
      .subscribe( () => {
        // Update the DOM with the updated post, not necessary in this case but a good example
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === post.id);
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  }

  deletePost(postId: string) {
    this.http.delete(`http://localhost:3000/api/posts/${postId}`)
      .subscribe( () => {
        // Delete the post from the post list
        const updatedPosts = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPosts
        // Update the DOM with the updated post list
        this.postsUpdated.next([...this.posts]);
      });
  }
}
