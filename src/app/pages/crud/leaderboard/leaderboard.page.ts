import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.page.html',
  styleUrls: ['./leaderboard.page.scss'],
})
export class LeaderboardPage implements OnInit {

  segmentValue = 'all';

  leaderboardAll = [];
  leaderboardFriends = [];

  myUserId;

  constructor(private router: Router) { }

  ngOnInit() {
    const routerState = this.router.getCurrentNavigation().extras.state;
    this.leaderboardAll = routerState.all;
    this.leaderboardFriends = routerState.friends;
    this.myUserId = routerState.myUserId;
  }

}
