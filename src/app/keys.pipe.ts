import {PipeTransform, Pipe} from "@angular/core";

@Pipe({ name: 'keys', pure: false })
export class KeysPipe implements PipeTransform {
  public transform(value: any): any {
    return Object.keys(value);
  }
}
