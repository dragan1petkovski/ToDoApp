import { Component, Input, } from '@angular/core'
import { TicketResponse } from '../DTO/Ticket/TicketResponse'
import { DatePipe } from "@angular/common"
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap"
import { ConnectionSvc } from "../Service/ConnectionSvc"
import { TicketModalComponent } from './TicketModalComponent'
import { DeleteModalComponent } from "../DeleteComponenet/DeleteModalComponent"

@Component({
    selector: 'ticket',
    standalone: true,
    templateUrl: 'TicketComponent.html',
    imports: [DatePipe],
    providers: [ConnectionSvc]
})
export class TicketComponenet {
    @Input() ticket!: TicketResponse

    constructor(private activeModal: NgbModal, private http: ConnectionSvc) {

    }

    protected OpenModal(type: "update" | "delete") {
        if (type == 'update') {
            let _updateModal = this.activeModal.open(TicketModalComponent, { animation: false })
            _updateModal.componentInstance._updateTicket = this.ticket
        }
        else {
            this.activeModal.open(DeleteModalComponent, { animation: false })
        }
    }
}
