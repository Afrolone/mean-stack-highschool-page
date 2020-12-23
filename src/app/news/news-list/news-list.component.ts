import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Article } from '../article.model';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit, OnDestroy {

  

  public articles: Article[] = [];
  isLoading = false;
  totalArticles = 0;
  articlesPerPage = 4;
  currentPage = 1;
  pageSizeOptions = [4, 8];
  userIsAuthenticated = false;
  private articlesSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public articleService: ArticleService, 
    private authService: AuthService
  ) {}

  ngOnInit() { 
    this.isLoading = true;
    this.articleService.getArticles(this.articlesPerPage, this.currentPage);
    this.articlesSub = this.articleService
      .getArticleUpdateListener()
      .subscribe((articleData: { articles: Article[]; articleCount: number }) => {
        this.isLoading = false;
        this.articles = articleData.articles;
        this.totalArticles = articleData.articleCount;
        console.log("article count: " + articleData.articleCount);
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.articlesPerPage = pageData.pageSize;
    this.articleService.getArticles(this.articlesPerPage, this.currentPage);
  }

  onDelete(articleId: string) {
    this.isLoading = true;
    this.articleService.deleteArticle(articleId).subscribe(() => {
      this.articleService.getArticles(this.articlesPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.articlesSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
