import { booleanAttribute, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { signalr_endpoint } from '../StaticObjects/api_endpoints';
import { TicketStatusUpdate } from '../DTO/Ticket/TicketStatusUpdate'
import { DataShare } from './DataShare';
import { TicketResponse } from '../DTO/Ticket/TicketResponse';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  constructor( private dataShare: DataShare) {}
  ngOnInit(){
      this.hubConnection = new signalR.HubConnectionBuilder().withUrl(signalr_endpoint.signalr).build()
      this.hubConnection.start().then(() => console.log("Signal R is sucessfully connected"))
                                .catch(() => console.log("Signal R failed"));
  }

  public UpdateTicketStatus = (ticketstatus: TicketStatusUpdate ) => {
      this.hubConnection.invoke('UpdateTicketStatus', ticketstatus)
  }

  public StatusUpdate = (originalTicketStatus: number,originalTicketId: number) => {
      this.hubConnection.on('ResponseStatus', (ticket:TicketResponse) => {
             let temp = this.dataShare.GetTicketList()
             if(ticket != undefined)
             {
                 let tempIndex = temp.findIndex(t => t.id == ticket.id && t.projectid== ticket.projectid)
                 if(temp[tempIndex])
                 {
                     if(temp[tempIndex].status != ticket.status)
                     {
                        temp[tempIndex] = ticket
                        this.dataShare.SetTicketList([...temp])
                     }
                 }
             }
             else
             {
                 let tempIndex = temp.findIndex(t => t.id == originalTicketId)
                 temp[tempIndex].status = originalTicketStatus
                 this.dataShare.SetTicketList([...temp])
             }
      })
  }
}
