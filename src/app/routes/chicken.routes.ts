import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { GitHistoryComponent } from '../git-history/git-history.component';
import { FileHistoryComponent } from '../file-history/file-history.component';
import { GitCherrypickComponent } from '../git-cherrypick/git-cherrypick.component';

const routes: Routes = [
  { path: "", redirectTo: "/gitHistory", pathMatch: "full" },
  { path: "dashboard", component: DashboardComponent },
  { path: "gitHistory", component: GitHistoryComponent },
  { path: "gitCherryPick", component: GitCherrypickComponent },
  {path: "fileHistory",component: FileHistoryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: "enabled" })],
  exports: [RouterModule]
})
export class ChickenRoutingModule { }
