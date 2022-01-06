import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})

export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;

  // Dependency injection for PostsService
  constructor(public postsService: PostsService) {}

  ngOnInit(): void {
      this.postsService.getPosts();
      this.isLoading = true;
      this.postsSub = this.postsService.getPostUpdateListener()
        .subscribe( (posts: Post[]) => {
          this.isLoading = false;
          this.posts = posts;
        });
  }

  onDelete(postId: string) {
    this.postsService.deletePost(postId);
  }

  ngOnDestroy(): void {
      this.postsSub.unsubscribe();
  }
}
