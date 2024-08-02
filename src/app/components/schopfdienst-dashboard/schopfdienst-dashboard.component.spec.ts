import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchopfdienstDashboardComponent } from './schopfdienst-dashboard.component';

describe('SchopfdienstDashboardComponent', () => {
  let component: SchopfdienstDashboardComponent;
  let fixture: ComponentFixture<SchopfdienstDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchopfdienstDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchopfdienstDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
