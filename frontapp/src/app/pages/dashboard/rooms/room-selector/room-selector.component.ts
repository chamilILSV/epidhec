import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'ngx-room-selector',
  templateUrl: './room-selector.component.html',
  styleUrls: ['./room-selector.component.scss'],
})
export class RoomSelectorComponent {
  @Output() select: EventEmitter<number> = new EventEmitter();

  selectedRoom: null;
  sortedRooms = [];
  viewBox = '-20 -20 618.88 407.99';
  isIE = !!(navigator.userAgent.match(/Trident/)
            || navigator.userAgent.match(/MSIE/)
            || navigator.userAgent.match(/Edge/));
  isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') >= 0;
  roomSvg = {
    borders: [{
    }],
    stokedAreas: [
    ],
    rooms: [
      {
        id: '0',
        name: { text: 'appleStore', x: 270, y: 150 },
        area: { d: 'M 50 200 C 200 0 350 0 500 200 L 350 300 L 200 300 L 50 200 ' },
        border: { d: 'M 50 200 C 200 0 350 0 500 200 L 350 300 L 200 300 L 50 200 '},
      },
    ],
  };

  constructor() {
    this.selectRoom('0');
  }

  private sortRooms() {
    this.sortedRooms = this.roomSvg.rooms.slice(0).sort((a, b) => {
      if (a.id === this.selectedRoom) {
        return 1;
      }
      if (b.id === this.selectedRoom) {
        return -1;
      }
      return 0;
    });
  }

  selectRoom(roomNumber) {
    this.select.emit(roomNumber);
    this.selectedRoom = roomNumber;
    this.sortRooms();
  }
}
