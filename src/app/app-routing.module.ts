import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/auth/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'exercise-detail',
    loadChildren: () => import('./pages/crud/exercise-detail/exercise-detail.module').then( m => m.ExerciseDetailPageModule)
  },
  {
    path: 'weight-detail',
    loadChildren: () => import('./pages/crud/weight-detail/weight-detail.module').then( m => m.WeightDetailPageModule)
  },
  {
    path: 'leaderboard',
    loadChildren: () => import('./pages/crud/leaderboard/leaderboard.module').then( m => m.LeaderboardPageModule)
  },
  {
    path: 'friends',
    loadChildren: () => import('./pages/crud/friends/friends.module').then( m => m.FriendsPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
