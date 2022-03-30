import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeightService {

  constructor(private http: HttpClient) { }

  createWeight(weightData, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

      return this.http.post('https://fitstats.mauexe.com/api/weight/create', weightData, {headers});
  }
}
