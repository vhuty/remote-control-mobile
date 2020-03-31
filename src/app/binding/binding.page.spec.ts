import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Binding } from './binding.page';

describe('Tab2Page', () => {
  let component: Binding;
  let fixture: ComponentFixture<Binding>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Binding],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Binding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
