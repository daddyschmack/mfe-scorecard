import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveScorecard } from './live-scorecard';

describe('LiveScorecard', () => {
  let component: LiveScorecard;
  let fixture: ComponentFixture<LiveScorecard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveScorecard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveScorecard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
