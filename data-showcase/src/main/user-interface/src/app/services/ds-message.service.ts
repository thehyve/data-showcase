import {Injectable} from '@angular/core';
import { Message } from 'primeng/primeng';
import { Subject } from 'rxjs/Subject';

export type MessageType = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class DSMessageService {

  messages = new Subject<Message>();

  constructor() {}

  addInfoMessage(type: MessageType, infoMsg: string, detail: string) {
    this.messages.next({severity: type, summary: infoMsg, detail:detail});
  }

}
