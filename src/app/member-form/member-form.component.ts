import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/models/member.model';
import { MemberService } from 'src/services/member.service';
import {MatSnackBar} from '@angular/material/snack-bar';

import { AnimationItem } from 'lottie-web';
import { AnimationOptions } from 'ngx-lottie';


@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css'],
})
export class MemberFormComponent implements OnInit {

  form: any;
  currentId: string = '';
  memberReceivedByService: any;

  loadedForm:boolean = false;
  updating:boolean = false;
  selected = 'na';

  roleAnimation: AnimationOptions = {
    path: '/assets/lottie/permissions.json',
  };
  profileAnimation: AnimationOptions = {
    path: '/assets/lottie/profile.json',
  };
  resumeAnimation: AnimationOptions = {
    path: '/assets/lottie/resume.json',
  };

  animationCreated(animationItem: AnimationItem): void {
  }

  constructor(
    private memberService: MemberService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchMemberData();
  }

  file: File | undefined;

  loadedPdf:boolean = false;
  pdfFile:File | undefined;
  fileUploadChange(event:any){
    this.file = event.target.files[0];
  }




  fetchMemberData(){
    this.currentId = this.activatedRoute.snapshot.params.id;
    if (!!this.currentId) {
      this.memberService.getMemeberById(this.currentId).then((member) => {
        this.memberReceivedByService = member;
        console.log('Found member');
        console.log(member);
        this.initForm(member);
      });
    } else {
      this.initForm(null);
    }
  }

  updateType() :void{
    this.memberService.updateType(this.currentId,this.selected).then(()=>{
      this.fetchMemberData();
      this._snackBar.open("Updated role","close",{
        duration: 3000
      });
    });
  }

  fetchResume(): void{
    this.memberService.getResume(this.memberReceivedByService.cv).then((res)=>{
      var blob = new Blob([res], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    });
  }

  updateResume() : void{
    if(this.file != undefined){
      this.memberService.updateResume(this.currentId,this.file!).then(()=>{
        this._snackBar.open("Updated resume","close",{
          duration: 3000
        });
      })
    }else{
      this._snackBar.open("Please choose a resume first","close",{
        duration: 3000
      });
    }
  }

  onSubmit(): void {
    
    console.log(this.form.value);
    const memberToSave: Member = {
      ...this.memberReceivedByService,
      ...this.form.value,
    };
    memberToSave.type = this.selected;
    console.log(memberToSave);

    
    this.memberService
      .saveMember(memberToSave)
      .then(() => {
        this.fetchMemberData();
        this._snackBar.open("Updated details","close",{
          duration: 3000
        });
      });
  }

  initForm(member: Member | null): void {

    if(member?.type=="etd"){
      this.form =new FormGroup({
        cin: new FormControl(member?.cin, [Validators.required]),
        nom: new FormControl(member?.nom, [Validators.required]),
        prenom: new FormControl(member?.prenom, [Validators.required]),
        dateNaissance: new FormControl(member?.date_naissance, [Validators.required]),
        dateInscription: new FormControl(member?.date_inscription, [Validators.required]),
        diplome: new FormControl(member?.diplome, [Validators.required]),
      });
    }else if(member?.type=="ens"){
      this.form =new FormGroup({
        cin: new FormControl(member?.cin, [Validators.required]),
        nom: new FormControl(member?.nom, [Validators.required]),
        prenom: new FormControl(member?.prenom, [Validators.required]),
        dateNaissance: new FormControl(member?.date_naissance, [Validators.required]),
        grade: new FormControl(member?.grade, [Validators.required]),
        etablissement: new FormControl(member?.etablissement, [Validators.required]),
      });
    }
    
    
    this.selected = member? member!.type:"na";
    this.loadedForm=true;
  }
}
