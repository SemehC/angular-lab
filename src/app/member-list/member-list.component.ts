import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Member } from 'src/models/member.model';
import { MemberService } from 'src/services/member.service';
import { ConfirmDialog } from '../dialog-component/confirm-dialog';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
})
export class MemberListComponent implements OnInit {
  
  currentDisplay: Member[] = [];

  allMembers: Member[] = [];
  supervisedStudents: Member[] = [];
  unsupervisedStudents: Member[] = [];

  

  isAdmin:boolean =false;
  isStudent:boolean =false;
  isTeacher:boolean =false;

  ngOnInit(): void {
    this.fetchDataSource();
    this.isAdmin = this.memberService.isAdmin();
    this.isStudent = this.memberService.isStudent();
    this.isTeacher = this.memberService.isTeacher();
  }
  async fetchDataSource(): Promise<void> {
    await this.getAllMembers();
    this.currentDisplay = this.allMembers;
  }

  displayedColumns = [
    'id',
    'cin',
    'name',
    'type',
    'cv',
    'createdDate',
    'actions',
  ];
  fetchedName = {
    name: '',
  };

  
  async getAllMembers() {
    this.allMembers = await this.memberService.getAllMemebers();
    await this.getSupervisedStudents();
    if(this.memberService.getCurrentUser() != undefined)
      this.allMembers = this.allMembers.filter((member) => (member.id.toString() != this.memberService.getCurrentUser()!.id.toString() && member.type!="adm")); 
  }

  onRemove(id: string) {
    this.memberService.deleteMemberById(id).then(() => {
      this.getAllMembers();
    });
  }

  changeDisplayedData(event:any){
    if(event.value == "0"){
      this.currentDisplay = this.allMembers;
    }
    if(event.value == "1"){
      this.currentDisplay = this.supervisedStudents;
    }
    if(event.value == "2"){
      this.currentDisplay = this.unsupervisedStudents;
    }
  }


  isSupervised(member:Member): Boolean{   
    for(var i =0;i< this.supervisedStudents.length;i++){
      if(this.supervisedStudents[i].encadrant.id == this.memberService.getCurrentUser()!.id)
        return true;
    }
    return false;
    //return this.supervisedStudents.includes(member);
  }

  superviseMember(member:Member){
    this.memberService.superviseStudent(member.id,this.memberService.getCurrentUser()!.id).then(()=>{
      this.getAllMembers();
    });
  }

  unsuperviseMember(member:Member){
    this.memberService.unsuperviseStudent(member.id).then(()=>{
      this.getAllMembers();
    });
  }

  async getSupervisedStudents(){
    if(!this.memberService.isTeacher())
      return;
    
    this.supervisedStudents = await this.memberService.getSupervisedBy(this.memberService.getCurrentUser()!.id);
    this.supervisedStudents = this.supervisedStudents.filter((member) => (member.id.toString() != this.memberService.getCurrentUser()!.id.toString() && member.type!="adm")); 


    this.unsupervisedStudents = this.allMembers.filter((member)=>(member.type=="etd" && member.encadrant==null));

  } 

  getResume(member:Member){
    this.memberService.getResume(member.cv).then((res)=>{
      var blob = new Blob([res], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    });
  } 

  async searchMembers(input: string) {
    console.log("searching for : "+input);
    await this.getAllMembers();
    const foundMemebersById = this.searchMembersById(input, this.allMembers);
    const foundMembersByName = this.searchMemebersByName(input, this.allMembers);
    console.log(foundMembersByName);
    const allFoundMembers = foundMembersByName.concat(foundMemebersById);
    if (
      (allFoundMembers === undefined || allFoundMembers.length === 0) &&
      input === ''
    ){

    }else{
      this.allMembers = allFoundMembers;
    }
    
  }
  searchMembersById(input: string, members:Member[]) {
    if (input != '') {
      return members.filter((member) => member.id.toString().includes(input));
    }
    return [];
  }

  searchMemebersByName(input: string,members:Member[]) {
    if (input != '') {
      return members.filter((member) => {
        if(member.nom){
          return member.nom.includes(input);
        }
        return "";
      });
    }
    return [];
  }

  openRemoveMemberDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.onRemove(id);
      }
    });
  }

  constructor(
    private memberService: MemberService,
    private dialog: MatDialog
  ) {}
}
