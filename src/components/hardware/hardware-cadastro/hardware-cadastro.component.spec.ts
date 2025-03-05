import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HardwareCadastroComponent } from './hardware-cadastro.component';

describe('HardwareCadastroComponent', () => {
  let component: HardwareCadastroComponent;
  let fixture: ComponentFixture<HardwareCadastroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HardwareCadastroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HardwareCadastroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
