import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { api_endpoints, signalr_endpoint } from '../StaticObjects/api_endpoints';
import { TicketStatusUpdate } from '../DTO/Ticket/TicketStatusUpdate'
import { DataShare } from './DataShare';
import { TicketResponse } from '../DTO/Ticket/TicketResponse';
import { environment } from "../../environments/environment"

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  constructor( private dataShare: DataShare) {
        this.hubConnection = new signalR.HubConnectionBuilder().withUrl(environment.signalrUrl,{transport: signalR.HttpTransportType.WebSockets, skipNegotiation: true})
                                                               //.configureLogging(signalR.LogLevel.Trace) -> it is use for troubleshooting signalr connection
                                                               .build()
    }

  public StartConnection()
  {
      console.log(this.hubConnection.state)
    if( this.hubConnection.state === "Connected" )
    {
        console.log("Already Connected")
        return;
    }
    else
    {
        this.hubConnection.start().then(() => console.log("Signal R is sucessfully connected"))
                                .catch(() => console.log("Signal R failed"));
    }

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
                     if((originalTicketStatus == 2 && ticket.status != 2) || ticket.status == 2)
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
