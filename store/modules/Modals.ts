import { makeAutoObservable, observable } from 'mobx'

interface Props {
  body?: React.ReactNode
  visible?: boolean
  ressetTenderFiles?: boolean
}

export class Modals {
  visible: boolean = false
  ressetTenderFiles: boolean = false
  visibleError505: boolean = false
  errorMassage: string | null = ''
  body: React.ReactNode = null
  height: string | number = 'auto'

  constructor() {
    makeAutoObservable(this, { body: observable.ref }, { autoBind: true })
  }
  resetData() {
    this.visible = false
    this.body = null
    this.visibleError505 = false
  }
  openModal(data: Props) {
    this.body = data.body
    this.visible = true
  }
  openModalError() {
    this.visibleError505 = true
    this.visible = true
  }
  resetTenderFilers() {
    this.ressetTenderFiles = true
  }
  openTenderFilers() {
    this.ressetTenderFiles = false
  }
}
