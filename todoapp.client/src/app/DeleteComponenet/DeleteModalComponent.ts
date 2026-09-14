import { Component } from '@angular/core'
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConnectionSvc } from '../Service/ConnectionSvc'
import { ProjectRequest } from '../DTO/Project/ProjectRequest';
import { api_endpoints } from '../StaticObjects/api_endpoints'
import { ProjectResponse } from '../DTO/Project/ProjectResponse';
import { TicketResponse } from '../DTO/Ticket/TicketResponse';
@Component({
    standalone: true,
    templateUrl: "DeleteModalComponent.html",
    imports: [ReactiveFormsModule],
    providers: [ConnectionSvc]
})

export class DeleteModalComponent<T> {
    constructor(protected activeModal: NgbActiveModal, private conService: ConnectionSvc) { }
    protected id!: string
    protected name!: string
    protected type!: "ticket" | "project"
    protected DeleteItem() {
        switch (this.type) {
            case 'project':
                this.conService.DELETE(api_endpoints.project.concat(`/${this.id}`)).subscribe(res => this.activeModal.close(true), err => this.activeModal.close(false))
                break;
            case 'ticket':
                this.conService.DELETE(api_endpoints.ticket.concat(`/${this.id}`)).subscribe(res => this.activeModal.close(true), err => this.activeModal.close(false))
        }
        
    }
}
