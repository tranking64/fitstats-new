import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private http: HttpClient) { }

  addFriend(username, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      return this.http.post('https://fitstats.mauexe.com/api/friend/add', {friend_username: username}, {headers});
  }
}
