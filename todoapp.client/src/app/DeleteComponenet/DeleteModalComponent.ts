import { Component, inject } from '@angular/core'
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"
import { ConnectionSvc } from '../Service/ConnectionSvc'
import { api_endpoints } from '../StaticObjects/api_endpoints'
import { DataShare } from '../Service/DataShare'
import { LoadPageDataSvc } from '../Service/LoadPageDataSvc'
@Component({
    standalone: true,
    templateUrl: "DeleteModalComponent.html",
    imports: [],
    providers: [ConnectionSvc]
})

export class DeleteModalComponent {
    constructor(protected activeModal: NgbActiveModal, private conService: ConnectionSvc, private data: LoadPageDataSvc) { }
    dataShare = inject(DataShare)
    protected id!: string
    protected name!: string
    protected type!: "ticket" | "project"
    protected DeleteItem() {
        switch (this.type) {
            case 'project':
                this.conService.DELETE(api_endpoints.project.concat(`/${this.id}`)).subscribe(res => {
                    this.dataShare.SetProjectList(this.dataShare.GetProjectList().filter(p => p.id != this.id))
                    this.data.LoadData()
                    this.activeModal.close()
                }, err => this.activeModal.close())
                break;
            case 'ticket':
                this.conService.DELETE(api_endpoints.ticket.concat(`/${this.id}`)).subscribe(res => {
                    this.dataShare.SetTicketList(this.dataShare.GetTicketList().filter(t => t.id != Number(this.id)))
                    this.activeModal.close()
                }, err => this.activeModal.close())
        }
        
    }
}
