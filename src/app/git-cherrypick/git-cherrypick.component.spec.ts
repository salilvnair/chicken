import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GitCherrypickComponent } from './git-cherrypick.component';

describe('GitCherrypickComponent', () => {
  let component: GitCherrypickComponent;
  let fixture: ComponentFixture<GitCherrypickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GitCherrypickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GitCherrypickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
