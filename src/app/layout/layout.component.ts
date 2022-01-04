import { Component, NgZone, OnInit } from '@angular/core';
import { AuthService } from 'src/services/AuthService';
import firebase from 'firebase/compat/app';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { Member } from 'src/models/member.model';
import { MemberService } from 'src/services/member.service';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {

  options: AnimationOptions = {
    path: '/assets/lottie/loading.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }



  private getUserWithEmail = "http://localhost:4200/api/MEMBRE-SERVICE/membres/email/";
  private newUserLink = "http://localhost:4200/api/MEMBRE-SERVICE/membres/new";

  public currentUser:Member | undefined;
  
  public initializedPage:boolean = false;

  public isLoggedIn:boolean = false;
  public user: firebase.User | null = null;

  constructor(private memberService: MemberService,private authService: AuthService,private ngZone: NgZone,private router: Router,private http:HttpClient, private notifier:NotifierService) { 
     authService.afAuth.authState.subscribe(user => {
      if (user){
        this.user = user;
        this.handleLogin(user).then(_=>{
          this.isLoggedIn = true;
          this.initializedPage = true;
        });
      } else {
        this.isLoggedIn = false;
        this.initializedPage = true;
      }
    });
  }

  async handleLogin(user:firebase.User){
    await this.memberService.handleUserLogin(user);
    if(this.memberService.getCurrentUser()?.type == 'na'){
      this.notifier.notify('success',`Welcome ${this.memberService.getCurrentUser()?.nom} , please wait for an admin to assign a role to you`);
    }else if (this.memberService.getCurrentUser()?.type == 'ens'){
      this.notifier.notify('success',`Welcome ${this.memberService.getCurrentUser()?.nom} [teacher]`);
    }else if (this.memberService.getCurrentUser()?.type == 'adm'){
      this.notifier.notify('success',`Welcome ${this.memberService.getCurrentUser()?.nom} [admin]`);
    }else{
      this.notifier.notify('success',`Welcome ${this.memberService.getCurrentUser()?.nom} [student]`);
    }

    this.currentUser = this.memberService.getCurrentUser();
  }
  
  ngOnInit(): void {
    //this.checkWithApi();
  }



  tryGoogleLogin(): void {
    this.authService
      .doGoogleLogin();
  }

  logout():void{
    this.authService.doLogout();
    this.notifier.notify('success','Logged out');
    this.memberService.logoutUser();
    this.router.navigate(['/dashboard']);
  }

  successRedirect(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.ngZone.run(() => this.router.navigate(['/dashboard']));
  }
 

}


