import {Component, Injectable} from '@angular/core';
import {Message} from 'primeng/components/common/api';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
  template: '<p-growl [(value)]="msgs"></p-growl>'
})
@Injectable()
export class DSMessageService {

  constructor(private messageService: MessageService) {}

  addInfoMessage(type: string, infoMsg: string, detail: string) {
    this.messageService.add({severity: type, summary:infoMsg, detail:detail});
  }
  addSingle() {
    this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
  }

  addMultiple() {
    this.messageService.addAll([{severity:'success', summary:'Service Message', detail:'Via MessageService'},
      {severity:'info', summary:'Info Message', detail:'Via MessageService'}]);
  }

  clear() {
    this.messageService.clear();
  }
}
