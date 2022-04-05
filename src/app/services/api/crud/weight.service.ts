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

  getWeightEntries(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/weight/get', {headers});
  }

  getWeightWeek(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/weight/get/chartData/days', {headers});
  }

  getWeightYear(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/weight/get/chartData', {headers});
  }

  deleteWeight(weightId, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.delete('https://fitstats.mauexe.com/api/weight/delete/' + weightId, {headers});
  }

  updateWeight(weightData, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.put('https://fitstats.mauexe.com/api/weight/update/' + weightData.bodyweight_id,
      {
        weight: weightData.amount,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        weighted_date: weightData.weighted_date
      }, {headers});
  }
}
