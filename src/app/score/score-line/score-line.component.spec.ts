import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreLineComponent } from './score-line.component';



describe('ScoreLineComponent', () => {
  let component: ScoreLineComponent;
  let fixture: ComponentFixture<ScoreLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreLineComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
