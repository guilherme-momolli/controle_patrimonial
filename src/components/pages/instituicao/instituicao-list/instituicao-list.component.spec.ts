import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstituicaoListComponent } from './instituicao-list.component';

describe('InstituicaoListComponent', () => {
  let component: InstituicaoListComponent;
  let fixture: ComponentFixture<InstituicaoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InstituicaoListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstituicaoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
