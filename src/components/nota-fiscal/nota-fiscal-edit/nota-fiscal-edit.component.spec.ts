import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalEditComponent } from './nota-fiscal-edit.component';

describe('NotaFiscalEditComponent', () => {
  let component: NotaFiscalEditComponent;
  let fixture: ComponentFixture<NotaFiscalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
