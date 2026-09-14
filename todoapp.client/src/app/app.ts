import { ConnectionSvc } from "./Service/ConnectionSvc"
import { TicketComponenet } from '../app/Ticket/TicketComponent'
import { TicketModalComponent } from './Ticket/TicketModalComponent'
import { ProjectModalComponent } from './Project/ProjectModalComponent'
import { ProjectResponse } from "./DTO/Project/ProjectResponse"
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap"
import { DeleteModalComponent } from "./DeleteComponenet/DeleteModalComponent"
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, DragDropModule } from "@angular/cdk/drag-drop"
import { TicketResponse } from './DTO/Ticket/TicketResponse'
import { Component, signal, WritableSignal, ChangeDetectorRef } from '@angular/core'
import { api_endpoints } from "./StaticObjects/api_endpoints"

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.html',
    imports: [TicketComponenet],
    providers: [ConnectionSvc]
})

export class App {

    constructor(private modal: NgbModal, private http: ConnectionSvc, private cdr: ChangeDetectorRef) {
    }

    protected projectList: WritableSignal<ProjectResponse[]> = signal([])
    protected ticketList: WritableSignal<TicketResponse[]> = signal([])

    ngOnInit() {
        this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(plist => {
            this.projectList.set(plist)
            this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${plist[0].id}`)).subscribe(tlist => this.ticketList.set(tlist))
        })

    }

    public OpenModal(type: string, item: ProjectResponse | TicketResponse | null) {
        console.log(type)
        switch (type) {
            case 'project':
                if (item == null) {
                    this.modal.open(ProjectModalComponent, { animation: false }).result.then(result => {

                        if (result != undefined) {
                            let temp = this.projectList()
                            temp.push(result)
                            this.projectList.set(temp)
                            this.cdr.detectChanges();
                        }

                    })
                }
                else {

                    let _modal: NgbModalRef = this.modal.open(ProjectModalComponent, { animation: false })
                    _modal.componentInstance._updateProject = item
                    _modal.result.then(result => {

                        if (result != undefined) {
                            let temp = this.projectList()
                            temp[temp.findIndex(p => p.id == result.id)]=result
                            this.projectList.set(temp)
                            this.cdr.detectChanges();
                        }

                    })
                }

                break;
            case 'ticket':
                this.modal.open(TicketModalComponent, { size: 'lg', animation: false }).result.then(res => {
                    let temp = this.ticketList()
                    temp.push(res)
                    this.ticketList.set(temp)
                })
        }
        
    }

    public GetProjectTickets(projectId: string) {
        console.log(projectId)
    }

    public DeleteProject(type: string, name: string, id: string) {
        let _modal: NgbModalRef = this.modal.open(DeleteModalComponent, { animation: false })
        _modal.componentInstance.type = type
        _modal.componentInstance.name = name
        _modal.componentInstance.id = id
        _modal.result.then(result => {
            if (result) {
                let temp = this.projectList()
                this.projectList.set(temp.filter(p => p.id != id))
                this.cdr.detectChanges();
            }
        })
    }
}

