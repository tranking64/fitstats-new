/* eslint-disable @typescript-eslint/naming-convention */
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

  getTrainingEntries(exerciseType, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/train/get/' + exerciseType, {headers});
  }

  getTrainingWeek(exerciseType, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/train/get/chartData/days/' + exerciseType, {headers});
  }

  getTrainingYear(exerciseType, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/train/get/chartData/' + exerciseType, {headers});
  }

  deleteTraining(trainingId, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.delete('https://fitstats.mauexe.com/api/train/delete/' + trainingId, {headers});
  }

  updateTraining(exerciseData, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.put('https://fitstats.mauexe.com/api/train/update/' + exerciseData.exercise_id,
      {
        exercise_type_id: exerciseData.exercise_type_id,
        reps: exerciseData.reps,
        weight: exerciseData.weight,
        executed_at: exerciseData.executed_at,
      }, {headers});
  }
}
