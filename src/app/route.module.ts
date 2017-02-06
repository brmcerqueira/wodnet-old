import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {DisconnectedMasterComponent} from "./disconnected.master.component";
import {ConnectedMasterComponent} from "./connected.master.component";
import {PageNotFoundComponent} from "./page.not.found.component";
import {ChatComponent} from "./chat.component";

const routes: Routes = [
  { path: '', component: DisconnectedMasterComponent },
  { path: 'connected', component: ConnectedMasterComponent, children: [
    { path: '', redirectTo: 'chat', pathMatch: 'full' },
    { path: 'chat', component: ChatComponent },
  ]},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class RouteModule {}
