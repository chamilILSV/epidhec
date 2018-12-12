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

  srcImg: string = "assets/images/noPassageUser.png";

  firstBeaconTimestramp: Date;
  dernierBeaconTimestamp: Date;
  avantDernierBeaconTimestamp: Date;

  lastLastPath: string;

  timePathMin : number = 0;
  timePathSec : number = 0;
  timeBetween : number = 0;

  isNoPassage = false;
  isAllPassage = false;
  isLeftOnlyPassage = false;
  isRightOnlyPassage = false;

  constructor(private httpClient: HttpClient) { }

  randomIntFromInterval(min,max) // min and max included
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

  updateData() {

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
          this.lastLastPath = this.userPath[this.userPath.length - 1];

          this.getTimeStamp(this.userPath[this.userPath.length - 1], this.currentUser.id).then((data: string) => {
            console.log("dernier beacon = ", data, Object);
            this.dernierBeaconTimestamp = new Date(data);
            console.log("dernier beacon = ", this.dernierBeaconTimestamp);
          })
          if (Object.keys(this.userPath).length > 2) {

            this.getTimeStamp(this.userPath[this.userPath.length - 2], this.currentUser.id).then((data: string) => {
              console.log("avant dernier beacon = ", data);
              this.avantDernierBeaconTimestamp = new Date(data);
              console.log("avant dernier beacon = ", this.dernierBeaconTimestamp);
              console.log("getime = ", this.dernierBeaconTimestamp.getTime);
              var randomval = this.randomIntFromInterval(5000, 15000);
              this.timeBetween += Math.round(this.randomIntFromInterval(1000, 3000) / 1000);
              console.log("timePath = ", this.timePathMin);
            })
          }

          if (this.userPath.length == 1) {
            this.srcImg = "assets/images/noPassageUser.png";
          } else if (this.userPath.length == 2 && this.userPath[1] == "H&M") {
            this.srcImg = "assets/images/rightPassageUser.png"
          } else if (this.userPath.length == 2 && this.userPath[1] == "Lego") {
            this.srcImg = "assets/images/leftPassageUser.png"
          } else {
            this.srcImg = "assets/images/allPassageUser.png"
          }
        });
      }
      console.log("users = ", this.users);
    })
  }

  loopData() {
    while (1) {
      console.log("des BARRES ");
      this.changeUser(this.currentUser);
      setTimeout(function() {
        console.log("lol");
      }, 1000)
    }
  }

  ngOnInit() {
    this.updateData();
  }

  changeUser(user) {
    console.log("user = ", user);
    this.currentUser = user;

    this.getUserPath(this.currentUser.id).then(data => {
      this.userPath = data;
      console.log("userPath = ", this.userPath);

      this.timeBetween += Math.round(this.randomIntFromInterval(1000, 3000) / 1000);

      if (this.userPath[this.userPath.length - 1] != this.lastLastPath) {
        this.timePathMin += Math.round(this.timeBetween / 60);
        this.timePathSec = Math.round(this.timeBetween % 60);
        this.lastLastPath = this.userPath[this.userPath.length - 1];
        this.timeBetween = 0;
      }

      this.getTimeStamp(this.userPath[Object.keys(this.userPath)[Object.keys(this.userPath).length - 1]], this.currentUser.id).then((data: string) => {
        console.log("dernier beacon change = ", data);
        this.dernierBeaconTimestamp = new Date(data);
        console.log("dernier beacon change = ", this.dernierBeaconTimestamp);
      })
      if (Object.keys(this.userPath).length > 2) {
        this.getTimeStamp(this.userPath[Object.keys(this.userPath)[Object.keys(this.userPath).length - 2]], this.currentUser.id).then((data: string) => {
          console.log("avant dernier beacon = ", data);
          this.avantDernierBeaconTimestamp = new Date(data);
          console.log("avant dernier beacon = ", this.dernierBeaconTimestamp);
          console.log("gettime === ", this.dernierBeaconTimestamp.getTime());
        })
      }

      if (this.userPath.length == 1) {
        this.srcImg = "assets/images/noPassageUser.png";
      } else if (this.userPath.length == 2 && this.userPath[1] == "H&M") {
        this.srcImg = "assets/images/rightPassageUser.png"
      } else if (this.userPath.length == 2 && this.userPath[1] == "Lego") {
        this.srcImg = "assets/images/leftPassageUser.png"
      } else {
        this.srcImg = "assets/images/allPassageUser.png"
      }
    });
  }

  getTimeStamp(storeName: string, userId: string) {
    console.log("store name = ", storeName)
    return this.httpClient.get("http://localhost:8000/getTimestamp/" + storeName + "/" + userId).toPromise()
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
