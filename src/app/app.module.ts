import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import {TranslateModule, TranslateService} from "ng2-translate";
import {MasterComponent} from "./master.component";
import {RouteModule} from "./route.module";
import {GameComponent} from "./game.component";
import {PageNotFoundComponent} from "./page.not.found.component";
import {ConnectorService} from "./services/connector.service";
import {KeysPipe} from "./keys.pipe";
import {DiceService} from "./services/dice.service";
import {CharacterComponent} from "./character.component";
import {ChronicleComponent} from "./chronicle.component";
import {ChronicleService} from "./services/chronicle.service";
import {CharacterGuard} from "./character.guard";
import {ChronicleGuard} from "./chronicle.guard";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

@NgModule({
  declarations: [
    MasterComponent,
    GameComponent,
    CharacterComponent,
    ChronicleComponent,
    PageNotFoundComponent,
    KeysPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouteModule,
    NgbModule.forRoot(),
    TranslateModule.forRoot()
  ],
  providers: [ConnectorService, ChronicleService, DiceService, CharacterGuard, ChronicleGuard],
  bootstrap: [MasterComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use('pt');
  }
}
