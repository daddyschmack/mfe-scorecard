import { TestBed } from '@angular/core/testing';

import { TeamBalancerService } from './team-balancer.service';

describe('TeamBalancerService', () => {
  let service: TeamBalancerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamBalancerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
