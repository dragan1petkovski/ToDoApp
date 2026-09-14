import { Component, WritableSignal, signal } from '@angular/core';
import { ProjectResponse } from '../DTO/Project/ProjectResponse';
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"
import { ConnectionSvc } from "../Service/ConnectionSvc"
import { api_endpoints } from "../StaticObjects/api_endpoints"
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TicketRequest } from "../DTO/Ticket/TicketRequest"
import { TicketResponse } from "../DTO/Ticket/TicketResponse"

@Component({
    standalone: true,
    templateUrl: 'TicketModalComponent.html',
    imports: [ReactiveFormsModule],
    providers: [ConnectionSvc]

})
export class TicketModalComponent {
    constructor(protected activeModal: NgbActiveModal, private http: ConnectionSvc) { }
    public projectId!: string
    protected projectList: WritableSignal<ProjectResponse[]> = signal([])
    protected createTicketForm = new FormGroup({
        title: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]*$/)]),
        description: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 !@#$%^&*()]*$/)]),
        project: new FormControl("")
    })

    ngOnInit() {
        this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(res => {
            this.projectList.set(res)
            this.http.GET<TicketResponse[]>(api_endpoints.ticket)
        })
    }

    protected CreateTicket() {
        let newTicket: TicketRequest = {
            title: this.createTicketForm.controls.title.value ?? "",
            description: this.createTicketForm.controls.description.value ?? "",
            projectid: this.createTicketForm.controls.project.value??""
        }

        this.http.POST<TicketResponse>(api_endpoints.ticket,JSON.stringify(newTicket)).subscribe(res => this.activeModal.close(newTicket))
    }
}

