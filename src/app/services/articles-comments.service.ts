import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import firebase from "firebase";
import { Comments } from '../models/comments.model';


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  comment: Comments[] = [];
  commentSubject = new Subject<Comments[]>();

  constructor() { }

  emitComment() {
    this.commentSubject.next(this.comment);
  }

  saveComment(id: number) {
    firebase.database().ref('/articles/' + id + '/comments').set(this.comment);
  }

  getComments(id: number) {
    firebase.database().ref('/articles/'+ id +'/comments')
      .on('value', (data) => {
        this.comment = data.val() ? data.val() : [];
        this.emitComment();
      })
  }

  createNewComments(newArticle: Comments, id: number) {
    this.comment.push(newArticle);
    this.saveComment(+id);
    this.emitComment();
  }

  removeComment(comment: Comments, id: number){
    const articleIndexToRemove = this.comment.findIndex(
      (commentEl) => {
        if (commentEl === comment) {
          return true;
        } else {return false;}
      }
    );
    this.comment.splice(articleIndexToRemove, 1);
    this.saveComment(+id);
    this.emitComment();
  }
}
