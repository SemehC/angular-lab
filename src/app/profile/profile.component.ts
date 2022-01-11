import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/models/member.model';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profileMember: Member | undefined;
  loadedProfile: boolean = false;
  form: any;

  isOwnProfile:boolean = false;

  constructor(private activatedRoute: ActivatedRoute,private memberService: MemberService,private _snackBar: MatSnackBar,private router: Router,
    private ngZone: NgZone) { }

  ngOnInit(): void {
    this.loadProfile();
  }

  async loadProfile(){
    try{

      this.profileMember = await this.memberService.getMemeberById(this.activatedRoute.snapshot.params.id);
    if(!this.profileMember){
      this._snackBar.open("Profil n'existe pas","Fermer",{
        duration: 3000
      });
      this.ngZone.run(() => this.router.navigate(['/dashboard']));

    }
    this.isOwnProfile = this.profileMember.id == this.memberService.getCurrentUser()?.id;
    this.initForm(this.profileMember);
    console.log(this.profileMember);
    this.loadedProfile = true;

    }catch(e){
      this._snackBar.open("Profil n'existe pas","Fermer",{
        duration: 3000
      });
      this.ngZone.run(() => this.router.navigate(['/dashboard']));
    }
    
  }

  getResume(){
    this.memberService.getResume(this.profileMember!.cv).then((res)=>{
      var blob = new Blob([res], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    });
  } 

  onSubmit(): void {
    
    console.log(this.form.value);
    const memberToSave: Member = {
      ...this.profileMember,
      ...this.form.value,
    };

    
    this.memberService
      .saveMember(memberToSave)
      .then(() => {
        this.loadProfile();
        this._snackBar.open("Profil mis à jour","Fermer",{
          duration: 3000
        });
      });
  }

  file: File | undefined;
  fileUploadChange(event:any){
    this.file = event.target.files[0];
  }

  updateResume() : void{
    if(this.file != undefined){
      this.memberService.updateResume(this.profileMember!.id,this.file!).then(()=>{
        this.loadProfile();
        this._snackBar.open("CV mis à jour","Fermer",{
          duration: 3000
        });
      })
    }else{
      
    }
  }

  initForm(member: Member | null): void {

    if(member?.type=="etd"){
      this.form =new FormGroup({
        cin: new FormControl(member?.cin, [Validators.required]),
        nom: new FormControl(member?.nom, [Validators.required]),
        prenom: new FormControl(member?.prenom, [Validators.required]),
        dateNaissance: new FormControl(member?.dateNaissance, [Validators.required]),
        dateInscription: new FormControl(member?.date_inscription, [Validators.required]),
        diplome: new FormControl(member?.diplome, [Validators.required]),
      });
    }else if(member?.type=="ens"){
      this.form =new FormGroup({
        cin: new FormControl(member?.cin, [Validators.required]),
        nom: new FormControl(member?.nom, [Validators.required]),
        prenom: new FormControl(member?.prenom, [Validators.required]),
        dateNaissance: new FormControl(member?.dateNaissance, [Validators.required]),
        grade: new FormControl(member?.grade, [Validators.required]),
        etablissement: new FormControl(member?.etablissement, [Validators.required]),
      });
    }else{
      this.form =new FormGroup({
        cin: new FormControl(member?.cin, [Validators.required]),
        nom: new FormControl(member?.nom, [Validators.required]),
        prenom: new FormControl(member?.prenom, [Validators.required]),
        dateNaissance: new FormControl(member?.dateNaissance, [Validators.required]),
      });
    }
    
    
  }
}
