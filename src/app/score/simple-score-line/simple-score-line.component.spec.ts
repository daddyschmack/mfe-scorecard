import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpoleScoreLine } from './simple-score-line.component';

describe('SimpoleScoreLine', () => {
  let component: SimpoleScoreLine;
  let fixture: ComponentFixture<SimpoleScoreLine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpoleScoreLine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SimpoleScoreLine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
