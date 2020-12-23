import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Article } from './article.model';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ArticleService {

  private articles: Article[] = [];
  private articlesUpdated = new Subject<{ articles: Article[]; articleCount: number }>();

  constructor(public http: HttpClient, private router: Router) { }

  getArticles(articlesPerPage: number, currentPage: number) {
    
    const queryParams = `?pagesize=${articlesPerPage}&page=${currentPage}`;
    console.log("http://localhost:3000/api/news" + queryParams);
    this.http
      .get<{ message: string; articles: any; maxArticles: number }>(
        "http://localhost:3000/api/news" + queryParams
      )
      .pipe(
        map(articleData => {
          return {
            articles: articleData.articles.map(article => {
              return {
                id: article._id,
                title: article.title,
                content: article.content,
                imagePath: article.imagePath
              };
            }),
            maxArticles: articleData.maxArticles
          };
        })
      )
      .subscribe(cleansedArticles => {
        this.articles = cleansedArticles.articles;
        this.articlesUpdated.next({
          articles: [...this.articles],
          articleCount: cleansedArticles.maxArticles
        });
      });
  }

  getArticleUpdateListener() {
    return this.articlesUpdated.asObservable();
  }

  getArticle(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string }>(
      "http://localhost:3000/api/news/" + id
    );
  }

  addArticle(title: string, content: string, image: File) {
    const articleData = new FormData();
    articleData.append("title", title);
    articleData.append("content", content);
    articleData.append("image", image, title);
    this.http
      .post<{ message: string; article: Article }>(
        "http://localhost:3000/api/news",
        articleData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateArticle(id: string, title: string, content: string, image: File | string) {
    let articleData: Article | FormData;
    if (typeof image === "object") {
      articleData = new FormData();
      articleData.append("id", id);
      articleData.append("title", title);
      articleData.append("content", content);
      articleData.append("image", image, title);
    } else {
      articleData = {
        id: id,
        title: title,
        content: content,
        imagePath: image
      };
    }
    this.http
      .put("http://localhost:3000/api/news/" + id, articleData)
      .subscribe( response => {
          this.router.navigate(["/"]);
      });
  }

  deleteArticle(articleId: string) {
    /*console.log("delete method");
    console.log("http://localhost:3000/api/news/" + articleId); */
    return this.http.delete("http://localhost:3000/api/news/" + articleId);
      /*
      .subscribe( response => {
        console.log(response);
      }); */
  }
}