import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { map, Subject } from "rxjs";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts() {
    this.http.get<any>('http://localhost:3000/api/posts')
      // Accepts an operator to modify the data. In this case, we are returning the same object essentially, but renaming the _id from the database to be id, matching the model we created on the front-end.
      .pipe(map(postData => {
        return postData.map( post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
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
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>(`http://localhost:3000/api/posts/${id}`);
  }

  addPost(title: string, content: string, image: File) {
    // Used if JSON is fine, but JSON doesn't allow for blob/file types
    // const post: Post = {id: null, title: title, content: content};

    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
      .subscribe((res) => {
        const post: Post = {id: res.post.id, title: title, content: content, imagePath: res.post.imagePath};
        // Add the post to the post list.
        this.posts.push(post);
        // Update the DOM with the updated post list
        this.postsUpdated.next([...this.posts]);
        // Redirect to the post list
        this.router.navigate(['/'])
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // Below is fine if not dealing in images
    // const post: Post = {id: id, title: title, content: content, imagePath: null};

    // Check if the image is a string (image hasn't been changed) or a File (image has been changed) because the cases should be handled differently
    let postData: Post | FormData;
    if (typeof(image) === 'object') {
      postData = new FormData();
      postData.append("id", id)
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {id: id, title: title, content: content, imagePath: image}
    }

    this.http.put(`http://localhost:3000/api/posts/${id}`, postData)
      .subscribe( res => {
        // Update the DOM with the updated post, not necessary in this case but a good example
        const updatedPosts = [...this.posts];
        const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        const post: Post = {id: id, title: title, content: content, imagePath: null};
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
        // Redirect to the post list
        this.router.navigate(['/'])
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
