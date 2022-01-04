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
  datasource: Member[] = [];

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
    this.datasource = await this.memberService.getAllMemebers();
    if(this.memberService.getCurrentUser() != undefined)
      this.datasource = this.datasource.filter((member) => member.id.toString() != this.memberService.getCurrentUser()!.id.toString()); 
  }

  onRemove(id: string) {
    this.memberService.deleteMemberById(id).then(() => {
      this.getAllMembers();
    });
  }

  async searchMembers(input: string) {
    console.log("searching for : "+input);
    await this.getAllMembers();
    const foundMemebersById = this.searchMembersById(input, this.datasource);
    const foundMembersByName = this.searchMemebersByName(input, this.datasource);
    console.log(foundMembersByName);
    const allFoundMembers = foundMembersByName.concat(foundMemebersById);
    if (
      (allFoundMembers === undefined || allFoundMembers.length === 0) &&
      input === ''
    ){

    }else{
      this.datasource = allFoundMembers;
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
