import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPresComponent } from './map-pres.component';

describe('MapPresComponent', () => {
  let component: MapPresComponent;
  let fixture: ComponentFixture<MapPresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
