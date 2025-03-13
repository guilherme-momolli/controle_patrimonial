import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalCreateComponent } from './nota-fiscal-create.component';

describe('NotaFiscalCreateComponent', () => {
  let component: NotaFiscalCreateComponent;
  let fixture: ComponentFixture<NotaFiscalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
