import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MittagsdienstDashboardComponent } from './mittagsdienst-dashboard.component';

describe('MittagsdienstDashboardComponent', () => {
  let component: MittagsdienstDashboardComponent;
  let fixture: ComponentFixture<MittagsdienstDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MittagsdienstDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MittagsdienstDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
