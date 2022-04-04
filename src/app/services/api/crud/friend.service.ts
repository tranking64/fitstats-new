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

  getFriendlist(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/friend/get', {headers});
  }

  getFriendRequests(accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.get('https://fitstats.mauexe.com/api/friend/get/invites', {headers});
  }

  acceptReq(friendId, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.put('https://fitstats.mauexe.com/api/friend/accept/' + friendId, {}, {headers});
  }

  declineReq(friendId, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    return this.http.delete('https://fitstats.mauexe.com/api/friend/decline/' + friendId, {headers});
  }

  removeFriend(friendId, accessToken): Observable<any> {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);

    // eslint-disable-next-line @typescript-eslint/naming-convention
    const body = {friend_id: friendId};

    return this.http.delete('https://fitstats.mauexe.com/api/friend/remove', {headers, body});
  }
}
