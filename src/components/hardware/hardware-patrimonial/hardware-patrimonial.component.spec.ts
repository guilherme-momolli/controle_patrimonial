import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwarePatrimonialComponent } from './hardware-patrimonial.component';

describe('HardwarePatrimonialComponent', () => {
  let component: HardwarePatrimonialComponent;
  let fixture: ComponentFixture<HardwarePatrimonialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwarePatrimonialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwarePatrimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
