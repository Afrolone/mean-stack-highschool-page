import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsListComponent } from './news/news-list/news-list.component';
import { NewsCreateComponent } from './news/news-create/news-create.component';
import { AlumniListComponent } from './alumni/alumni-list/alumni-list.component';
import { AlumniCreateComponent } from './alumni/alumni-create/alumni-create.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { NewsViewComponent } from './news/news-view/news-view.component';

const routes: Routes = [
  { path: '', component: NewsListComponent },
  { path: 'news', component: NewsListComponent },
  { path: 'news/create', component: NewsCreateComponent },
  { path: 'news/edit/:articleId', component: NewsCreateComponent },
  { path: 'news/view/:articleId', component: NewsViewComponent },
  { path: 'alumni', component: AlumniListComponent },
  { path: 'alumni/create', component: AlumniCreateComponent },
  { path: 'alumni/edit/:alumnusId', component: AlumniCreateComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
