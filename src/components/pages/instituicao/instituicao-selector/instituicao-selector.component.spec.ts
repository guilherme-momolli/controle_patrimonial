import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoSelectorComponent } from './instituicao-selector.component';

describe('InstituicaoSelectorComponent', () => {
  let component: InstituicaoSelectorComponent;
  let fixture: ComponentFixture<InstituicaoSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicaoSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
