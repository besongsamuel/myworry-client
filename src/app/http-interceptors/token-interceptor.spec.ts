import { TokenInterceptor } from './token-interceptor';
import { TestBed } from '@angular/core/testing';
import { AuthService } from '../services/auth.service';

describe('TokenInterceptor', () => {

  let tokenIterceptor: TokenInterceptor;
  let authServiceSpy: jasmine.SpyObj<AuthService>

  beforeEach(() => {
    const spy = jasmine.createSpy('AuthService');
    TestBed.configureTestingModule({
      providers: [{provide : AuthService, useValue: spy}]
    });
    authServiceSpy = TestBed.get(AuthService);
    tokenIterceptor = new TokenInterceptor(authServiceSpy);
    
  });

  it('should create an instance', () => {
    expect(tokenIterceptor).toBeTruthy();
    
  });
});
