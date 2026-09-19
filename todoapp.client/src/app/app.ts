import { ConnectionSvc } from "./Service/ConnectionSvc"
import { TicketComponenet } from '../app/Ticket/TicketComponent'
import { TicketModalComponent } from './Ticket/TicketModalComponent'
import { ProjectModalComponent } from './Project/ProjectModalComponent'
import { ProjectResponse } from "./DTO/Project/ProjectResponse"
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap"
import { DeleteModalComponent } from "./DeleteComponenet/DeleteModalComponent"
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule } from "@angular/cdk/drag-drop"
import { TicketResponse } from './DTO/Ticket/TicketResponse'
import { Component } from '@angular/core'
import { TicketStatus } from "./StaticObjects/SearchObjects"
import { DataShare } from "./Service/DataShare"
import { CurrentProject } from './Service/CurrentProject'
import { SignalRService } from './Service/SignalRService'
import { LoadPageDataSvc } from './Service/LoadPageDataSvc'

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.html',
    imports: [TicketComponenet,CdkDropList, CdkDrag,DragDropModule],
    providers: [ConnectionSvc]
})

export class App {

    constructor(private modal: NgbModal, private http: ConnectionSvc, protected dataShare: DataShare, private currentProject: CurrentProject, private signalr: SignalRService, private data: LoadPageDataSvc) {
        this.signalr.ngOnInit()
    }

    ngOnInit() {
        this.data.LoadData()

    }

    public OpenModal(type: string, item: ProjectResponse | TicketResponse | null) {
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
        this.RemoveActiveClass()
        this.ActivateButtonById(projectId)
        this.currentProject.SetCurrentProjectId(projectId)
        this.data.LoadTicketsByProjectId(projectId)
    }

    public DeleteProject(type: string, name: string, id: string) {
        let _modal: NgbModalRef = this.modal.open(DeleteModalComponent, { animation: false })
        _modal.componentInstance.type = type
        _modal.componentInstance.name = name
        _modal.componentInstance.id = id
 
    }

    public Drop(event: CdkDragDrop<TicketResponse[]>)
    {
        let temp!: TicketResponse[]
        let tempIndex!: number
        if(event.container != event.previousContainer)
        {
            switch (event.container.id)
            {

                case "0":
                    temp = this.dataShare.GetTicketList()
                    tempIndex = this.dataShare.GetTicketIndexNumber(event.item.data.id)
                    temp[tempIndex].status = 0
                    this.dataShare.SetTicketList([...temp])
                    this.signalr.UpdateTicketStatus({ticketId: event.item.data.id, projectId: event.item.data.projectid, status: 0})
                    this.signalr.StatusUpdate(Number(event.previousContainer.id),temp[tempIndex].id)
                    break;
                case "1":
                    temp = this.dataShare.GetTicketList()
                    tempIndex = this.dataShare.GetTicketIndexNumber(event.item.data.id)
                    temp[tempIndex].status = 1
                    this.dataShare.SetTicketList([...temp])
                    this.signalr.UpdateTicketStatus({ticketId: event.item.data.id, projectId: event.item.data.projectid, status: 1})
                    this.signalr.StatusUpdate(Number(event.previousContainer.id),temp[tempIndex].id)
                    break;
                case "2":
                    temp = this.dataShare.GetTicketList()
                    tempIndex = this.dataShare.GetTicketIndexNumber(event.item.data.id)
                    temp[tempIndex].status = 2
                    this.dataShare.SetTicketList([...temp])
                    this.signalr.UpdateTicketStatus({ticketId: event.item.data.id, projectId: event.item.data.projectid, status: 2})
                    this.signalr.StatusUpdate(Number(event.previousContainer.id),temp[tempIndex].id)
                    break;
            }
        }

    }

    private RemoveActiveClass()
	{
		let navlinks: HTMLCollection = document.getElementsByClassName("projectbuttons")
		for(let i=0; i < navlinks.length; i++)
		{
			navlinks[i].classList.remove("active")

		}
	}

    private ActivateButtonById(id: string)
	{
		try
		{
			let navlink = document.getElementById(id)
			navlink?.classList.add("active")
		}
		catch
		{
			console.error("Invalid navlink class")
		}
	}

    public SearchTicket() {
        let searchString = document.getElementById("ticketSearch") as HTMLInputElement
        let ticketList: TicketResponse[] = this.dataShare.GetTicketList().filter(t => t.projectid == this.currentProject.GetCurrentProjectId())
        var split: string[] = searchString.value.split(":")
        let output!: TicketResponse[]
        switch(split.length)
        {
            case 3:
                try {
                    const [status, property, text] = split
                    switch (property){
                        case "title":
                            output = ticketList.filter(t => t.status == TicketStatus[status] && t.title.includes(text)).sort((a,b) => a.title.localeCompare(b.title))
                            break;
                        case "description":
                            output = ticketList.filter(t => t.status == TicketStatus[status] && t.description?.includes(text)).sort((a,b) => {
                                if(a.description != null && b.description != null)
                                {
                                    return a.description.localeCompare(b.description)
                                }
                                else if(a.description != null && b.description == null)
                                {
                                    return 2
                                }
                                else if(a.description == null && b.description != null)
                                {
                                    return -2
                                }
                                else
                                {
                                    return 0
                                }
                            })
                            break;
                    }
                    break;
                }
                catch{
                    console.error("Invalid status or property itesm")
                    break;
                }
            case 2:
                try {
                    const [status, text] = split
                    output = ticketList.filter(t => t.status == TicketStatus[status] && (t.title.includes(text) || t.description?.includes(text)) ).sort((a,b) => a.title.localeCompare(b.title))
                    break;
                }
                catch {
                    console.error("Invalid status")
                    break;
                }
            case 1:
            {
                output = ticketList.filter(t => t.title.includes(split[0]) || t.description?.includes(split[0])).sort((a,b) => a.title.localeCompare(b.title))
                break;
            }
            default:
            {
                if(split.length > 3)
                {
                    console.error(`To may filters 3 is limit ${split}`)
                }
            }
        }
        let reminingTicketList = ticketList.filter(t => !output.includes(t))
        this.dataShare.SetTicketList([...output,...reminingTicketList])

        
    }
}

