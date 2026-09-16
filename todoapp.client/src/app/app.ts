import { ConnectionSvc } from "./Service/ConnectionSvc"
import { TicketComponenet } from '../app/Ticket/TicketComponent'
import { TicketModalComponent } from './Ticket/TicketModalComponent'
import { ProjectModalComponent } from './Project/ProjectModalComponent'
import { ProjectResponse } from "./DTO/Project/ProjectResponse"
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap"
import { DeleteModalComponent } from "./DeleteComponenet/DeleteModalComponent"
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, DragDropModule } from "@angular/cdk/drag-drop"
import { TicketResponse } from './DTO/Ticket/TicketResponse'
import { Component, ChangeDetectorRef } from '@angular/core'
import { api_endpoints } from "./StaticObjects/api_endpoints"
import { DataShare } from "./Service/DataShare"

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.html',
    imports: [TicketComponenet],
    providers: [ConnectionSvc]
})

export class App {

    constructor(private modal: NgbModal, private http: ConnectionSvc, private cdr: ChangeDetectorRef, protected dataShare: DataShare) {
    }

    ngOnInit() {
        this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(plist => {
            this.dataShare.SetProjectList(plist)
            this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${plist[0].id}`)).subscribe(tlist => this.dataShare.SetTicketList(tlist))
        })

    }

    public OpenModal(type: string, item: ProjectResponse | TicketResponse | null) {
        console.log(type)
        switch (type) {
            case 'project':
                if (item == null) {
                    this.modal.open(ProjectModalComponent, { animation: false })
                }
                else {

                    let _modal: NgbModalRef = this.modal.open(ProjectModalComponent, { animation: false })
                    _modal.componentInstance._updateProject = item
                    
                }

                break;
            case 'ticket':
                this.modal.open(TicketModalComponent, { size: 'lg', animation: false })
        }
        
    }

    public GetProjectTickets(projectId: string) {
        this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${projectId}`)).subscribe(tlist => this.dataShare.SetTicketList(tlist))
    }

    public DeleteProject(type: string, name: string, id: string) {
        let _modal: NgbModalRef = this.modal.open(DeleteModalComponent, { animation: false })
        _modal.componentInstance.type = type
        _modal.componentInstance.name = name
        _modal.componentInstance.id = id
 
    }
}

