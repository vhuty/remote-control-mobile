import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Devices } from './devices.page';

describe('Tab1Page', () => {
  let component: Devices;
  let fixture: ComponentFixture<Devices>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Devices],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Devices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
