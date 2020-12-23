import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Report } from './report.model';

interface Suggestions {
  numvalue: Number;
  value: string;
}

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  suggestions: Suggestions[] = [
    {numvalue: 0, value: 'Feedback'},
    {numvalue: 1, value: 'Report a bug'},
    {numvalue: 2, value: 'Feature request'},
  ];

  reports: Report[] = [
    {id: "sdasd", name: "Afrolone", email: "asdas_ASdas-Ad", type: "Feedback", message: "Ne valjat stranica!"},
    {id: "s3123", name: "Afrolone2", email: "asdas_ASasdasds-Ad", type: "Report a bug", message: "Ne vasadtranica!"}
  ]

  userIsAuthenticated = false;
  private authStatusSub: Subscription;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }
}
