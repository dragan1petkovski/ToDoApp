import { Component, Input, } from '@angular/core'
import { TicketResponse } from '../DTO/Ticket/TicketResponse'
import { DatePipe } from "@angular/common"

@Component({
    selector: 'ticket',
    standalone: true,
    templateUrl: 'TicketComponent.html',
    imports: [DatePipe]
})
export class TicketComponenet {
    @Input() ticket!: TicketResponse
    ngOnInit() {
        console.log(this.ticket)
    }
}
