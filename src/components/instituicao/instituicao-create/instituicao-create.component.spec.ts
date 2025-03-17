import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoCreateComponent } from './instituicao-create.component';

describe('InstituicaoCreateComponent', () => {
  let component: InstituicaoCreateComponent;
  let fixture: ComponentFixture<InstituicaoCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicaoCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
