import { enableStaticRendering } from 'mobx-react-lite'
import { PrinterPage } from './modules/ModalError'
import { ModalError } from './modules/PrinterPage'
import { Modals } from './modules/Modals'
import { UserTokenRsk } from './modules/UserToken'

enableStaticRendering(typeof window === 'undefined')

export class RootStore {
  modalError: ModalError
  printerPage: PrinterPage
  modals: Modals
  userTokenRsk: UserTokenRsk

  constructor() {
    this.modalError = new ModalError()
    this.printerPage = new PrinterPage()
    this.modals = new Modals()
    this.userTokenRsk = new UserTokenRsk()
  }
}
