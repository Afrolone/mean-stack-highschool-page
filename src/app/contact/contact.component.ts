import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Report } from './report.model';
import { ReportService } from './report.service';
 
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
  enteredName = "";
  enteredEmail = "";
  enteredType = "";
  enteredMessage = "";
  report: Report;
  public reports: Report[];
  form: FormGroup;
  userIsAuthenticated = false;
  private reportsSub: Subscription;
  private authStatusSub: Subscription;


  suggestions: Suggestions[] = [
    {numvalue: 0, value: 'Feedback'},
    {numvalue: 1, value: 'Report a bug'},
    {numvalue: 2, value: 'Feature request'},
  ];
  /*
  reports: Report[] = [
    {id: "sdasd", name: "Afrolone", email: "asdas_ASdas-Ad", type: "Feedback", message: "Ne valjat stranica!"},
    {id: "s3123", name: "Afrolone2", email: "asdas_ASasdasds-Ad", type: "Report a bug", message: "Ne vasadtranica!"}
  ] */

  constructor(
    private authService: AuthService,
    public reportService: ReportService
  ) { }

  ngOnInit() {
    this.reportService.getReports();
    this.reportsSub = this.reportService
      .getReportUpdateListener()
      .subscribe((reportData: Report[]) => {
        this.reports = reportData;
      });
    
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      name : new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]
      }),
      email: new FormControl(null,
        {validators: [Validators.required, Validators.email]
      }),
      type: new FormControl(null,
        {validators: [Validators.required]
      }),
      message: new FormControl(null,
        {validators: [Validators.required]
      })
    });
  }

  onSaveReport() {
    console.log("method on save is RUN");
    if (this.form.invalid) {
      console.log("FORM INVALID");
      return;
    }
    this.reportService.addReport(
      this.form.value.name,
      this.form.value.email,
      this.form.value.type,
      this.form.value.message
    );
    this.form.reset();
  }

  onDelete(reportId: string) {
    this.reportService.deleteReport(reportId).subscribe(() => {
      this.reportService.getReports();
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
