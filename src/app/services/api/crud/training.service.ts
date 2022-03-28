import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private http: HttpClient) { }

  getExerciseTypes(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/train/exerciseTypes', {headers});
  }

  createTraining(trainingData, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

      return this.http.post('https://fitstats.mauexe.com/api/train/create', trainingData, {headers});
  }

  getLast14Days(accessToken, exerciseTypeId): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = { exercise_type_id: exerciseTypeId };

    return this.http.request('get', 'https://fitstats.mauexe.com/api/train/get/chartData/days', {headers, body});
  }
}
