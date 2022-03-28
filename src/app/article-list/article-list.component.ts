import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from '../models/articles.model';
import { ArticlesService } from '../services/articles.service';
import { AuthService } from '../services/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit, OnDestroy {

  article: Article[] = [];
  articleSubscription: Subscription | undefined;

  constructor(private articleService: ArticlesService, private router: Router, private authService: AuthService) { }

  user() {
    return this.authService.getUser()?.email;
  }

  onUpdateIdArticle(article: Article) {
    this.articleService.updateIdArticle(article);
  }


  ngOnInit(): void {
    this.articleSubscription = this.articleService.articleSubject.subscribe(
      (article: Article[]) => {
        this.article = article;
      }
    );
    this.articleService.getArticle();
    this.articleService.emitArticle();
  }

  onNewArticle() {
    this.router.navigate(['/articles', 'ajouter']);
  }

  onDeleteArticle(article: Article) {
    this.articleService.removeArticle(article);
  }

  onViewArticle(id: number) {
    this.router.navigate(['/articles', 'post', id]);
  }


  ngOnDestroy() {
    this.articleSubscription?.unsubscribe()
  }
}
