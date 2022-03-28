import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from 'src/app/models/articles.model';
import { ArticlesService } from 'src/app/services/articles.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {

  articleForm: FormGroup = this.formBuilder.group({});
  fileIsUploading = false;
  fileUrl: string = '';
  fileUploaded = false;

  constructor(private formBuilder: FormBuilder,
              private articleService: ArticlesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.articleForm = this.formBuilder.group({
      title: ['', Validators.required],
      desc: ['', Validators.required],
      articleText: ['', Validators.required]
    });
  }

  onSaveBook() {
    const title = this.articleForm.get('title')!!.value;
    const desc = this.articleForm.get('desc')!!.value;
    const author = this.getUserName()!!;
    const articleText = this.articleForm.get('articleText')!!.value;
    const newArticle = new Article(title, author, articleText, desc);
    if (this.fileUrl && this.fileUrl !== '') {
      newArticle.photo = this.fileUrl;
    }
    newArticle.date = new Date().toLocaleDateString();
    this.articleService.createNewArticle(newArticle);
    this.router.navigate(['/articles']);
  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.articleService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    )
  }

  getUserName() {
    return this.authService.getUser()!!.displayName!!;
  }


  detectFiles(event: any) {
    this.onUploadFile(event.target.files[0]);
  }

}
