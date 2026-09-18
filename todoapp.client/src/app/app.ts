import { ConnectionSvc } from "./Service/ConnectionSvc"
import { TicketComponenet } from '../app/Ticket/TicketComponent'
import { TicketModalComponent } from './Ticket/TicketModalComponent'
import { ProjectModalComponent } from './Project/ProjectModalComponent'
import { ProjectResponse } from "./DTO/Project/ProjectResponse"
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap"
import { DeleteModalComponent } from "./DeleteComponenet/DeleteModalComponent"
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, DragDropModule } from "@angular/cdk/drag-drop"
import { TicketResponse } from './DTO/Ticket/TicketResponse'
import { Component, ChangeDetectorRef, effect } from '@angular/core'
import { api_endpoints } from "./StaticObjects/api_endpoints"
import { DataShare } from "./Service/DataShare"
import { CurrentProject } from './Service/CurrentProject'

@Component({
    standalone: true,
    selector: 'app-root',
    templateUrl: './app.html',
    imports: [TicketComponenet,CdkDropList, CdkDrag,DragDropModule],
    providers: [ConnectionSvc]
})

export class App {

    constructor(private modal: NgbModal, private http: ConnectionSvc, private cdr: ChangeDetectorRef, protected dataShare: DataShare, private currentProject: CurrentProject) {
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
        this.RemoveActiveClass()
        this.ActivateButtonById(projectId)
        this.currentProject.SetCurrentProjectId(projectId)
        this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${projectId}`)).subscribe(tlist => {
            this.dataShare.SetTicketList(tlist)
            })
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
        let tempItem!: TicketResponse
        if(event.container != event.previousContainer)
        {
            switch (event.container.id)
            {
                case "inProgressList":
                    temp = this.dataShare.GetTicketList()
                    tempItem = event.item.data
                    tempItem.status = 1
                    temp[this.dataShare.GetTicketIndexNumber(tempItem.id)] = tempItem
                    this.dataShare.SetTicketList([...temp])
                    break;
                case "newList":
                    temp = this.dataShare.GetTicketList()
                    tempItem = event.item.data
                    tempItem.status = 0
                    temp[this.dataShare.GetTicketIndexNumber(tempItem.id)] = tempItem
                    this.dataShare.SetTicketList([...temp])
                    break;
                case "completeList":
                    temp = this.dataShare.GetTicketList()
                    tempItem = event.item.data
                    tempItem.status = 2
                    temp[this.dataShare.GetTicketIndexNumber(tempItem.id)] = tempItem
                    this.dataShare.SetTicketList([...temp])
                    break
            }
            console.log()
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
}

