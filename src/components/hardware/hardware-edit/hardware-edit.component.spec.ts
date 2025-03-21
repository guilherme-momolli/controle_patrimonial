import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareEditComponent } from './hardware-edit.component';

describe('HardwareEditComponent', () => {
  let component: HardwareEditComponent;
  let fixture: ComponentFixture<HardwareEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwareEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwareEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
