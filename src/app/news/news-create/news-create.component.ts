import { Component, OnInit } from '@angular/core';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from '@angular/router';
import { ParamMap } from '@angular/router';
import { mimeType } from "../../utils/mime-type.validator";
//mime-type.validator

@Component({
  selector: 'app-news',
  templateUrl: './news-create.component.html',
  styleUrls: ['./news-create.component.css']
})
export class NewsCreateComponent implements OnInit {
  enteredTitle = "";
  enteredContent = "";
  article: Article;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = 'create';
  private articleId: string;

  constructor(
    public articleService: ArticleService, 
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      title : new FormControl(null, 
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      content : new FormControl(null, 
        {validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('articleId')) {
        this.mode = 'edit';
        this.articleId = paramMap.get('articleId');
        this.isLoading = true;
        this.articleService.getArticle(this.articleId).subscribe(articleData => {
          this.isLoading = false;
          this.article = {
            id: articleData._id,
            title: articleData.title,
            content: articleData.content,
            imagePath: articleData.imagePath
          };
          this.form.setValue({
            title: this.article.title,
            content: this.article.content,
            image: this.article.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.articleId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      console.log(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  onSaveArticle() {
    if(this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.articleService.addArticle(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.articleService.updateArticle(
        this.articleId, 
        this.form.value.title, 
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }
   
}
