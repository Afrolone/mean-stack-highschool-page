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
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit {
  article: Article;
  isLoading = false;
  imagePreview: string;
  private articleId: string;

  constructor(
    public articleService: ArticleService, 
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
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
      });
    });
  }
}
