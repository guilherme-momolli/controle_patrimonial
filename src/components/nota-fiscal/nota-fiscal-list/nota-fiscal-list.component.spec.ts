import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalListComponent } from './nota-fiscal-list.component';

describe('NotaFiscalListComponent', () => {
  let component: NotaFiscalListComponent;
  let fixture: ComponentFixture<NotaFiscalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
