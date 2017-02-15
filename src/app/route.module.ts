import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PageNotFoundComponent} from "./page.not.found.component";
import {GameComponent} from "./game.component";
import {CharacterComponent} from "./character.component";
import {ChronicleComponent} from "./chronicle.component";
import {CharacterGuard} from "./character.guard";
import {ChronicleGuard} from "./chronicle.guard";

const routes: Routes = [
  { path: '', redirectTo: 'game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'character', canActivate: [CharacterGuard], component: CharacterComponent },
  { path: 'chronicle', canActivate: [ChronicleGuard], component: ChronicleComponent },
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
