import { makeAutoObservable } from "mobx";

export class ModalError {
  visible: boolean = false;
  errorMassage: string | null = "";
  link: string | null = "";
  body: null = null;
  text: string = "null";

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  resetData() {
    this.errorMassage = null;
    this.link = null;
  }

  openModal(data: any) {
    this.visible = true;
    this.body = data.body
  
  }

  closeModal() {
    this.visible = false;
    this.resetData();
  }
  showModal() {
    return (this.visible = true);
  }
}
