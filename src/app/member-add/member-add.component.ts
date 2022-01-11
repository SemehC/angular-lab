import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Member } from 'src/models/member.model';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-member-add',
  templateUrl: './member-add.component.html',
  styleUrls: ['./member-add.component.css']
})
export class MemberAddComponent implements OnInit {

  form: any;
  loadedForm:boolean = false;

    
    
    constructor(private memberService: MemberService,private _snackBar: MatSnackBar, private router: Router,private ngZone: NgZone) { }

  ngOnInit(): void {
    this.setupForm();
  }

  addedMember : Member | undefined;
  selected = 'etd';

  addMember(){

    if(this.selected == 'na'){
      this._snackBar.open("Please choose a valid type","close",{
        duration: 3000
      });
    }
    const memberToSave: Member = {
      ...this.form.value,
    };


    memberToSave.type = this.selected;
    
    this.memberService
      .addNewMember(memberToSave)
      .then((res) => {
        this._snackBar.open("Added member","close",{
          duration: 3000
        });
        this.ngZone.run(() => this.router.navigate(['/members']));
      });
  }

  setupForm(){
    this.form =new FormGroup({
      cin: new FormControl("", [Validators.required]),
      nom: new FormControl("", [Validators.required]),
      prenom: new FormControl("", [Validators.required]),
      dateNaissance: new FormControl("", [Validators.required]),
    });
    this.loadedForm=true;
  }

}
