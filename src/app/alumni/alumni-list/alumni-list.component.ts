import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { Alumnus } from '../alumnus.model';
import { AlumnusService } from '../alumnus.service';

@Component({
  selector: 'app-alumni-list',
  templateUrl: './alumni-list.component.html',
  styleUrls: ['./alumni-list.component.css']
})
export class AlumniListComponent implements OnInit, OnDestroy {

  public alumni: Alumnus[] = [];
  isLoading = false;
  totalAlumni = 0;
  alumniPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10];
  userIsAuthenticated = false;
  private alumniSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public alumnusService: AlumnusService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    /*
    this.isLoading = true;
    this.alumnusService.getAlumni();
    this.alumniSub = this.alumnusService.getAlumnusUpdateListener()
      .subscribe((alumni: Alumnus[]) => {
        this.alumni = alumni
        this.isLoading = false;
      }); */
    this.isLoading = true;
    this.alumnusService.getAlumni(this.alumniPerPage, this.currentPage);
    this.alumniSub = this.alumnusService
      .getAlumnusUpdateListener()
      .subscribe((alumnusData: { alumni: Alumnus[]; alumniCount: number}) => {
        this.isLoading = false;
        this.alumni = alumnusData.alumni;
        this.totalAlumni = alumnusData.alumniCount;
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.alumniPerPage = pageData.pageSize;
    this.alumnusService.getAlumni(this.alumniPerPage, this.currentPage);
  }
  
  onDelete(alumnusId: string) {
    this.isLoading = true;
    this.alumnusService.deleteAlumni(alumnusId).subscribe(() => {
      this.alumnusService.getAlumni(this.alumniPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.alumniSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
