import {Injectable} from "@angular/core";
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {ConnectorService} from "./services/connector.service";

@Injectable()
export class CharacterGuard implements CanActivate {
  constructor(private connectorService: ConnectorService) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.connectorService.isConnected && !this.connectorService.isHost;
  }
}
