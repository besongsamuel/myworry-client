import { TestBed } from '@angular/core/testing';

import { ResponseInterceptorInterceptor } from './response-interceptor.interceptor';

describe('ResponseInterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ResponseInterceptorInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ResponseInterceptorInterceptor = TestBed.inject(ResponseInterceptorInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
