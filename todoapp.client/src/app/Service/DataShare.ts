import { Injectable, WritableSignal, signal } from "@angular/core"
import { TicketResponse } from "../DTO/Ticket/TicketResponse"
import { ProjectResponse } from "../DTO/Project/ProjectResponse"

@Injectable({
    providedIn: "root"
})

export class DataShare {
    private _ticketList: WritableSignal<TicketResponse[]> = signal([])
    private _projectList: WritableSignal<ProjectResponse[]> = signal([])

    public GetTicketList(): TicketResponse[] {
        return this._ticketList()
    }

    public GetProjectList(): ProjectResponse[] {
        return this._projectList()
    }


    public SetTicketList(ticketList: TicketResponse[]): void {
        this._ticketList.set(ticketList)
    }

    public SetProjectList(projectList: ProjectResponse[]): void {
        this._projectList.set(projectList)
    }
}
