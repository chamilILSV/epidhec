import { Component, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'ngx-map-pres',
  templateUrl: './map-pres.component.html',
  styleUrls: ['./map-pres.component.scss']
})
export class MapPresComponent implements OnInit {
  currentUser: any = null;
  users: any = [];
  userPath: any = [];
  dernierBeaconTimestamp: Date;
  avantDernierBeaconTimestamp: Date;
  isNoPassage = false;
  isAllPassage = false;
  isLeftOnlyPassage = false;
  isRightOnlyPassage = false;

  constructor(private httpClient: HttpClient) { }

  ngOnInit() {
    this.getUsers().then((data : any) => {
      console.log("data users = ", data);
      for (var element in data) {
        var userData = data;
        this.users.push({"username": userData[element].username, "id": element});
        if (this.currentUser == null) {
          this.currentUser = this.users[0];
        }

        this.getUserPath(this.currentUser.id).then(data => {
          this.userPath = data;
          console.log("userPath = ", this.userPath);

          this.getTimeStamp(this.userPath[Object.keys(this.userPath)[Object.keys(this.userPath).length - 1]]).then((data: string) => {
            this.dernierBeaconTimestamp = new Date(data);
            console.log("dernier beacon = ", this.dernierBeaconTimestamp);
          })
          if (this.userPath.length == 1) {
            this.isAllPassage = false;
            this.isLeftOnlyPassage = false;
            this.isRightOnlyPassage = false;
            this.isNoPassage = true;
          } else if (this.userPath.length == 2 && this.userPath[1] == "H&M") {
            this.isAllPassage = false;
            this.isLeftOnlyPassage = false;
            this.isRightOnlyPassage = true;
            this.isNoPassage = false;
          } else if (this.userPath.length == 2 && this.userPath[1] == "Lego") {
              this.isAllPassage = false;
              this.isLeftOnlyPassage = true;
              this.isRightOnlyPassage = false;
              this.isNoPassage = false;
          } else {
              this.isAllPassage = true;
              this.isLeftOnlyPassage = false;
              this.isRightOnlyPassage = false;
              this.isNoPassage = false;
          }
        });
      }
      console.log("users = ", this.users);
    })
  }

  changeUser(user) {
    console.log("user = ", user);
    this.currentUser = user;

    this.getUserPath(this.currentUser.id).then(data => {
      this.userPath = data;
      console.log("userPath = ", this.userPath);
      this.getTimeStamp(this.userPath[Object.keys(this.userPath)[Object.keys(this.userPath).length - 1]]).then((data: string) => {
        this.dernierBeaconTimestamp = new Date(data);
        console.log("dernier beacon = ", this.dernierBeaconTimestamp);
      })
      if (this.userPath.length == 1) {
        this.isAllPassage = false;
        this.isLeftOnlyPassage = false;
        this.isRightOnlyPassage = false;
        this.isNoPassage = true;
      } else if (this.userPath.length == 2 && this.userPath[1] == "H&M") {
        this.isAllPassage = false;
        this.isLeftOnlyPassage = false;
        this.isRightOnlyPassage = true;
        this.isNoPassage = false;
      } else if (this.userPath.length == 2 && this.userPath[1] == "Lego") {
          this.isAllPassage = false;
          this.isLeftOnlyPassage = true;
          this.isRightOnlyPassage = false;
          this.isNoPassage = false;
      } else {
          this.isAllPassage = true;
          this.isLeftOnlyPassage = false;
          this.isRightOnlyPassage = false;
          this.isNoPassage = false;
      }
    });
  }

  getTimeStamp(storeName: String) {
    console.log("store name = ", storeName)
    return this.httpClient.get("http://localhost:8000/getTimestamp/" + storeName + "/c5Fqe7A6COdJVbQqlkZpvYMxPmb2").toPromise()
    .then(data => { return data });
  }

  getUserPath(userId: string) {
    return this.httpClient.get("http://localhost:8000/getPathByUserID/" + userId).toPromise()
    .then(data => { return data });
  }

  getUsers() {
    return this.httpClient.get("http://localhost:8000/getUsers").toPromise()
    .then(data => { return data });
  }
}
