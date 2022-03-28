import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ArticleFormComponent } from './article-list/article-form/article-form.component';
import { ArticleListComponent } from './article-list/article-list.component';
import { SingleArticleComponent } from './article-list/single-article/single-article.component';
import { ConnexionComponent } from './auth/connexion/connexion.component';
import { InscriptionComponent } from './auth/inscription/inscription.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  { path: 'connexion', component: ConnexionComponent },
  { path: 'inscription', component: InscriptionComponent },
  { path: 'articles', component: ArticleListComponent },
  { path: 'articles/ajouter', canActivate: [AuthGuardService], component: ArticleFormComponent },
  { path: 'articles/post/:id', component: SingleArticleComponent },
  { path: '', component: HomePageComponent, pathMatch: 'full' },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
