import { Component, WritableSignal, signal, inject } from '@angular/core';
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
    constructor(protected activeModal: NgbActiveModal, private http: ConnectionSvc) { }
    dataShare = inject(DataShare)
    public projectId!: string
    protected projectList: WritableSignal<ProjectResponse[]> = signal([])

    protected _updateTicket!: TicketResponse

    protected modalType!: "Create" | "Update"

    protected createTicketForm = new FormGroup({
        title: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]*$/)]),
        description: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 !@#$%^&*()]*$/)]),
        project: new FormControl("")
    })

    ngOnInit() {
        this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(res => {
            this.projectList.set(res)
            if (this._updateTicket) {
                this.createTicketForm.controls.title.setValue(this._updateTicket.title)
                this.createTicketForm.controls.description.setValue(this._updateTicket.description)
                this.createTicketForm.controls.project.setValue(this._updateTicket.projectid)
                this.modalType = "Update"
            }
            else {
                this.modalType = "Create"
            }
        })



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
            this.dataShare.SetTicketList(temp)
            this.activeModal.close()
        }, err => this.activeModal.close())
    }

    protected UpdateTicket() {
        let newTicket: TicketRequest = {
            title: this.createTicketForm.controls.title.value ?? "",
            description: this.createTicketForm.controls.description.value ?? "",
            projectid: this.createTicketForm.controls.project.value ?? "",
            id: this._updateTicket.id
        }
        this.http.PUT<TicketResponse>(api_endpoints.ticket, JSON.stringify(newTicket)).subscribe(res => {
            let temp = this.dataShare.GetTicketList()
            temp[temp.findIndex(t => t.id = res.id)] = res
            this.dataShare.SetTicketList(temp)
            this.activeModal.close()
        }, err => this.activeModal.close())
    }
}

