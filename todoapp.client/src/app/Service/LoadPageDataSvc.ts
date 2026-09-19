import { Injectable} from "@angular/core"
import { TicketResponse } from "../DTO/Ticket/TicketResponse"
import { ProjectResponse } from "../DTO/Project/ProjectResponse"
import { DataShare } from "./DataShare"
import { ConnectionSvc} from "./ConnectionSvc"
import { api_endpoints } from "../StaticObjects/api_endpoints"
import { CurrentProject } from "../Service/CurrentProject"
@Injectable({
    providedIn: "root"
})

export class LoadPageDataSvc {
    constructor(private http: ConnectionSvc, protected dataShare: DataShare, protected currentProject: CurrentProject) {}

    public LoadData()
    {
        this.http.GET<ProjectResponse[]>(api_endpoints.project).subscribe(plist => {
            this.dataShare.SetProjectList(plist)
            if(plist.length > 0)
            {
                this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${plist[0].id}`)).subscribe(tlist => this.dataShare.SetTicketList(tlist))
                this.currentProject.SetCurrentProjectId(plist[0].id)
            }
            
        })
    }

    public LoadTicketsByProjectId(projectid: string)
    {
        this.http.GET<TicketResponse[]>(api_endpoints.ticket.concat(`?projectid=${projectid}`)).subscribe(tlist => {
            this.dataShare.SetTicketList(tlist)
            })
    }
}
