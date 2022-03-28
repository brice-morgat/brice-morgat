import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Article } from '../models/articles.model';
import firebase from "firebase";


@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  article: Article[] = [];
  articleSubject = new Subject<Article[]>();

  constructor() { }

  emitArticle() {
    this.articleSubject.next(this.article);
  }

  saveArticle() {
    firebase.database().ref('/articles').set(this.article);
  }



  getArticle() {
    firebase.database().ref('/articles')
      .on('value', (data) => {
        this.article = data.val() ? data.val() : [];
        this.emitArticle();
      })
  }

  getSingleArticle(id: number) {
    return new Promise<Article>(
      (resolve, reject) => {
        firebase.database().ref('/articles/'+ id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        )
      }
    )
  }

  createNewArticle(newArticle: Article) {
    this.article.push(newArticle);
    this.saveArticle();
    this.emitArticle();
  }

  removeArticle(article: Article){
    if (article.photo) {
      const storageRef = firebase.storage().refFromURL(article.photo);
      storageRef.delete().then(
        () => {
          console.log("Photo supprimée !");
        }
      ).catch(
        (error) => {
          console.log('Fichier non trouvé : ' + error);
        }
      );
    }
    const articleIndexToRemove = this.article.findIndex(
      (articleEl) => {
        if (articleEl === article) {
          return true;
        } else {return false;}
      }
    );
    this.article.splice(articleIndexToRemove, 1);
    firebase.database().ref('/articles').set(this.article);
    this.emitArticle();
  }


  updateIdArticle(article: Article) {
    const articleIndexToReplace = this.article.findIndex(
      (articleEl) => {
        if (articleEl === article) {
          return true;
        } else {return false;}
      }
    );

    article.id = articleIndexToReplace.toString();
    this.article.splice(articleIndexToReplace, 1, article)
    firebase.database().ref('/articles').update(this.article);
    this.emitArticle();
  }


  uploadFile(file: File) {
    return new Promise<string>(
      (resolve, reject) => {
        const almostUniqueFileName = Date.now().toString();
        const upload = firebase.storage().ref()
          .child('images/' + almostUniqueFileName + file.name)
          .put(file);
        upload.on(firebase.storage.TaskEvent.STATE_CHANGED,
          () => {
            console.log('Chargement en cours ...');
          },
            (error) => {
              console.log('Erreur de chargement : ' + error);
              reject();
          },
            () => {
              resolve(upload.snapshot.ref.getDownloadURL());
            }
          );
      }
    );
  }
}
