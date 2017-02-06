import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {TranslateModule, TranslateService} from "ng2-translate";
import {MasterComponent} from "./master.component";
import {ConnectedMasterComponent} from "./connected.master.component";
import {DisconnectedMasterComponent} from "./disconnected.master.component";
import {RouteModule} from "./route.module";
import {ChatComponent} from "./chat.component";
import {PageNotFoundComponent} from "./page.not.found.component";

@NgModule({
  declarations: [
    MasterComponent,
    ConnectedMasterComponent,
    DisconnectedMasterComponent,
    ChatComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouteModule,
    TranslateModule.forRoot()
  ],
  providers: [],
  bootstrap: [MasterComponent]
})
export class AppModule {
  constructor(translate: TranslateService) {
    translate.setDefaultLang('pt');
    translate.use('pt');
  }
}
