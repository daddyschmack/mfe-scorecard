import { TestBed } from '@angular/core/testing';

import { GolfCourseService } from './golf-course.service';

describe('GolfCourseService', () => {
  let service: GolfCourseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GolfCourseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
