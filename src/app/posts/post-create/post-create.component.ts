import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent  implements OnInit{
  private mode = 'create';
  private postId: string;
  post: Post;

  constructor(public postsService: PostsService, public route: ActivatedRoute) {}

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.postsService.addPost(form.value.title, form.value.content)
    } else {
      this.postsService.updatePost(this.postId, form.value.title, form.value.content);
    }
    // clears the form information and validations on submit after the data is used and no longer needed
    form.resetForm();
  }

  ngOnInit() {
    // Check if we have a postId parameter or not.
    this.route.paramMap.subscribe( (paramMap: ParamMap) => {
      // If it does exist, switch to edit mode, extract the postId and retrieve the post data.
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = {id: postData._id, title: postData.title, content: postData.content}
          })
      // If it doesn't exist, switch to create mode and set postId to null so it doesn't try to retrieve post data.
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }
}
