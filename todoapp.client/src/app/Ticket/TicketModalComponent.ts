import { Component, WritableSignal, signal, inject , ChangeDetectorRef} from '@angular/core';
import { ProjectResponse } from '../DTO/Project/ProjectResponse';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"
import { ConnectionSvc } from "../Service/ConnectionSvc"
import { api_endpoints } from "../StaticObjects/api_endpoints"
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketRequest } from "../DTO/Ticket/TicketRequest"
import { TicketResponse } from "../DTO/Ticket/TicketResponse"

import { DataShare} from "../Service/DataShare"

@Component({
    standalone: true,
    templateUrl: 'TicketModalComponent.html',
    imports: [ReactiveFormsModule],
    providers: [ConnectionSvc]

})
export class TicketModalComponent {
    constructor(protected activeModal: NgbActiveModal, private http: ConnectionSvc, private cdr: ChangeDetectorRef) {
        this.dataShare.GetProjectList();
    }
    protected dataShare = inject(DataShare)
    public projectId!: string

    protected _updateTicket!: TicketResponse

    protected modalType!: "Create" | "Update"

    protected createTicketForm = new FormGroup({
        title: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]*$/)]),
        description: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 !@#$%^&*()]*$/)]),
        project: new FormControl("")
    })

    ngOnInit() {
        if (this._updateTicket) {
            this.createTicketForm.controls.title.setValue(this._updateTicket.title)
            this.createTicketForm.controls.description.setValue(this._updateTicket.description)
            this.createTicketForm.controls.project.setValue(this._updateTicket.projectid)
            this.modalType = "Update"
        }
        else {
            this.modalType = "Create"
            this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(res => this.dataShare.SetProjectList(res))
        }



    }

    protected CreateTicket() {
        let newTicket: TicketRequest = {
            title: this.createTicketForm.controls.title.value ?? "",
            description: this.createTicketForm.controls.description.value ?? "",
            projectid: this.createTicketForm.controls.project.value ?? "",
            id: null
        }
        this.http.POST<TicketResponse>(api_endpoints.ticket, JSON.stringify(newTicket)).subscribe(res => {
            let temp = this.dataShare.GetTicketList()
            temp.push(res)
            this.dataShare.SetTicketList([...temp])
            this.activeModal.close()
        }, err => this.activeModal.close())
    }

    protected UpdateTicket() {
        let updateTicket: TicketRequest = {
            title: this.createTicketForm.controls.title.value ?? "",
            description: this.createTicketForm.controls.description.value ?? "",
            projectid: this.createTicketForm.controls.project.value ?? "",
            id: this._updateTicket.id
        }
        this.http.PUT<TicketResponse>(api_endpoints.ticket, JSON.stringify(updateTicket)).subscribe(res => {
            let temp = this.dataShare.GetTicketList()
            let originalItemIndex = temp.findIndex(t => t.id == res.id)
            if(temp[originalItemIndex].projectid == res.projectid)
            {
                temp[originalItemIndex]= res
                this.dataShare.SetTicketList([...temp])
            }
            else {
                this.dataShare.SetTicketList(temp.filter(t => t.id != res.id))
            }

            this.activeModal.close()
        }, err => this.activeModal.close())
    }
}

