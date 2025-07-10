import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcacaoAnonimaComponent } from './marcacao-anonima.component';

describe('MarcacaoAnonimaComponent', () => {
  let component: MarcacaoAnonimaComponent;
  let fixture: ComponentFixture<MarcacaoAnonimaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarcacaoAnonimaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcacaoAnonimaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
