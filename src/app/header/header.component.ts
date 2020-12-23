import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router  } from '@angular/router';
import { Subscription } from "rxjs";
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;
    currentRoute: string;

    constructor(private router: Router, private authService: AuthService) {
        console.log(this.router.url);
    }

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService
            .getAuthStatusListener()
            .subscribe(isAuthenticated => {
                this.userIsAuthenticated = isAuthenticated;
            });
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }

    getRoute() {
        console.log(this.router.url);
        //return this.router.url;
    }

    isNews() {
        return this.router.url === '/news';
    }

    isAlumni() {
        return this.router.url === '/alumni';
    }
}