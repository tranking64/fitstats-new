import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  signup(tmpUser): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post('https://fitstats.mauexe.com/api/auth/register', tmpUser, {headers});
  }

  login(userCredentials): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post('https://fitstats.mauexe.com/api/auth/login', userCredentials, {headers});
  }

  getCountries(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get('https://fitstats.mauexe.com/api/auth/countries', {headers});
  }

  getGenders(): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.get('https://fitstats.mauexe.com/api/auth/genders', {headers});
  }
}