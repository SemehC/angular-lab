import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GLOBAL } from 'src/app/app-config';
import { Member } from 'src/models/member.model';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root',
})
export class MemberService {

  private baseApi = "http://localhost:4200/api/MEMBRE-SERVICE/";
  private getUserWithEmail = "membres/email/";
  private newUserLink = "membres/new";
  private allMembersLink = "membres";

  public tab: Member[] = [];


  constructor(private httpClient: HttpClient) {}

  async handleUserLogin (user: firebase.User):Promise<Member>  {
    var us = await this.httpClient.get<Member>(this.baseApi+this.getUserWithEmail+user.email,{responseType: 'json'}).toPromise();
    if(!us){
      var data = {
        "nom":user.displayName,
        "email":user.email
      };
      var ns = await this.httpClient.post<Member>(this.baseApi+this.newUserLink,data).toPromise();
      localStorage.setItem("user",JSON.stringify(ns));
      return ns;
    }
    localStorage.setItem("user",JSON.stringify(us));
    return us;
  }

  getCurrentUser() : Member | undefined{
    if(localStorage.getItem("user")){
      var j = JSON.parse(localStorage.getItem("user")!);
      return <Member>j;
    }else{
      return undefined;
    }
  }

  isAdmin(): boolean{
    if(localStorage.getItem("user")){
      var j = <Member>JSON.parse(localStorage.getItem("user")!);
      return (j.type=='adm');
    }else{
      return false;
    }
  }

  isStudent(): boolean{
    if(localStorage.getItem("user")){
      var j = <Member>JSON.parse(localStorage.getItem("user")!);
      return (j.type=='etd');
    }else{
      return false;
    }
  }

  isTeacher(): boolean{
    if(localStorage.getItem("user")){
      var j = <Member>JSON.parse(localStorage.getItem("user")!);
      return (j.type=='ens');
    }else{
      return false;
    }
  }

  logoutUser(){
    localStorage.removeItem("user");
  }

  updateType(id : string ,type : string): Promise<void>{
    return this.httpClient.put<void>(this.baseApi+"membres/"+id+"/type?type="+type,[]).toPromise();
  }

  updateResume(id: string, resume: File): Promise<void>{
    const formData = new FormData();
    formData.append("cv",resume);
    return this.httpClient.put<void>(this.baseApi+"membres/"+id+"/cv",formData).toPromise();
  }

  getResume(path: string): Promise<Blob>{
    return this.httpClient.get(this.baseApi+"get-resume?path="+path, { responseType: 'blob' }).toPromise();
    
  }

  saveMember(member: Member): Promise<Member> {
    if(member.type=="etd"){
      return this.httpClient.put<Member>(this.baseApi+"membres/etudiant/"+member.id, member).toPromise();
    }else{
      return this.httpClient.put<Member>(this.baseApi+"membres/enseignant/"+member.id, member).toPromise();
    }
    /*const memberToSave = { ...member };
    memberToSave.id = member.id ?? Math.ceil(Math.random() * 10000);
    memberToSave.createdDate = new Date().toISOString();
    this.tab = [
      memberToSave,
      ...this.tab.filter((item) => item.id !== memberToSave.id),
    ];
    return new Promise((resolve) => resolve(memberToSave));*/
  }

  getMemeberById(id: string): Promise<Member> {
    return this.httpClient.get<Member>(this.baseApi+this.allMembersLink+"/"+id).toPromise();
  }
  deleteMemberById(id: string): Promise<any> {
    console.log("Deleting : "+id);
    return this.httpClient.delete<void>(this.baseApi+"membres/"+id).toPromise();
  }

  getAllMemebers(): Promise<Member[]> {
    return this.httpClient.get<Member[]>(this.baseApi+this.allMembersLink).toPromise();
  }

}
