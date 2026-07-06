import { makeAutoObservable } from "mobx";

export class PrinterPage {
  printPageComponent: any = null;
  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  printPage(component: any) {
    // this.router.push("/rsk-printer");
    this.printPageComponent = component;
  }
}
