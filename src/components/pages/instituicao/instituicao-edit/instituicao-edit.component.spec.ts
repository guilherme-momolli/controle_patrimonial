import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoEditComponent } from './instituicao-edit.component';

describe('InstituicaoEditComponent', () => {
  let component: InstituicaoEditComponent;
  let fixture: ComponentFixture<InstituicaoEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicaoEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
