import { ResourceLoader } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Article } from 'src/app/models/articles.model';
import { Comments } from 'src/app/models/comments.model';
import { CommentService } from 'src/app/services/articles-comments.service';
import { ArticlesService } from 'src/app/services/articles.service';
import { AuthService } from 'src/app/services/auth.service';
import firebase from 'firebase';

@Component({
  selector: 'app-single-article',
  templateUrl: './single-article.component.html',
  styleUrls: ['./single-article.component.scss']
})
export class SingleArticleComponent implements OnInit {
  article: Article = new Article('', '', '', '');
  comments: Comments = new Comments('','','');


  articleList: Comments[] = [];
  articleSubscription: Subscription | undefined;

  commentForm: FormGroup = this.formBuilder.group({});


  constructor(private route: ActivatedRoute,
              private authService: AuthService,
              private articleService: ArticlesService,
              private router: Router,
              private formBuilder: FormBuilder,
              private commentService: CommentService) { }

  ngOnInit() {
    this.article = new Article('', '', '', '');
    this.comments = new Comments('','','');
    const id = this.route.snapshot.params['id'];
    this.articleService.getSingleArticle(+id).then(
      (article : Article) => {
        this.article = article;
      });
      this.initForm();

      this.articleSubscription = this.commentService.commentSubject.subscribe(
        (articleList: Comments[]) => {
          this.articleList = articleList;
        }
      );

      this.commentService.getComments(id);
      this.commentService.emitComment();
  }

  onBack() {
    this.router.navigate(['/articles']);
  }

//commentaires

  initForm() {
    this.commentForm = this.formBuilder.group({
      title: ['', Validators.required],
      articleText: ['', Validators.required]
    });
  }

  onSaveComment() {
    const id = this.route.snapshot.params['id'];
    const title = this.commentForm.get('title')!!.value;
    const author = this.getUserName()!!;
    const articleText = this.commentForm.get('articleText')!!.value;
    const newComment = new Comments(title, author, articleText);
    this.commentService.createNewComments(newComment, id);
  }

  getUserName(){
    return this.authService.getUser()!!.displayName!!;
  }

  onDeleteComment(comment: Comments) {
    const id = this.route.snapshot.params['id'];
    this.commentService.removeComment(comment, id);
  }


  user() {
    return this.authService.getUser()?.email;
  }


  isAuth: boolean = false;

  isUserAuth() {
    if (firebase.auth().currentUser != null)
      return true;
    else
      return false;
  }
  
}
