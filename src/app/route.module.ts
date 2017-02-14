import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PageNotFoundComponent} from "./page.not.found.component";
import {GameComponent} from "./game.component";
import {CharacterComponent} from "./character.component";
import {ChronicleComponent} from "./chronicle.component";

const routes: Routes = [
  { path: '', redirectTo: 'game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'character', component: CharacterComponent },
  { path: 'chronicle', component: ChronicleComponent },
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
