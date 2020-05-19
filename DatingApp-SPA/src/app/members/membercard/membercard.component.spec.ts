/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { MembercardComponent } from './membercard.component';

describe('MembercardComponent', () => {
  let component: MembercardComponent;
  let fixture: ComponentFixture<MembercardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MembercardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembercardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
