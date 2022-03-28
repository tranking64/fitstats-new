import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  constructor(private http: HttpClient) { }

  getLeaderboardAll(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/leaderboard/get', {headers});
  }

  getLeaderboardFriends(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/leaderboard/friends', {headers});
  }
}
