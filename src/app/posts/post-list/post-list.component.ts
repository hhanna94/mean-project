import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  // styleUrls: ['./post-list.component.css']
})
export class PostListComponent {
  // Bind the posts variable to the storedPosts from the app
  @Input() posts = [];
}
