import { Component, inject, ChangeDetectorRef } from '@angular/core'
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap"
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ConnectionSvc } from '../Service/ConnectionSvc'
import { ProjectRequest } from '../DTO/Project/ProjectRequest';
import { api_endpoints } from '../StaticObjects/api_endpoints'
import { ProjectResponse } from '../DTO/Project/ProjectResponse';
import { DataShare } from "../Service/DataShare"
@Component({
    standalone: true,
    templateUrl: "ProjectModalComponent.html",
    imports: [ReactiveFormsModule],
    providers: [ConnectionSvc]
})

export class ProjectModalComponent {
    constructor(protected activeModal: NgbActiveModal, private conService: ConnectionSvc, private cdr: ChangeDetectorRef ) { }
    dataShare = inject(DataShare)
    _updateProject!: ProjectRequest
    protected type!: 'Update' | 'Create'
    ngOnInit() {

        if (this._updateProject == undefined) {
           
            this.type = 'Create'
        }
        else {
            this.type = "Update"
            this.createProjectForm.controls.name.setValue(this._updateProject.name)
            this.createProjectForm.controls.id.setValue(this._updateProject.id)
        }

        
    }

    createProjectForm = new FormGroup({
        name: new FormControl("", [Validators.required, Validators.pattern(/^[A-Za-z0-9 ]*$/)]),
        id: new FormControl()
    })

    protected CreateProject() {
        let project: ProjectRequest = { name: this.createProjectForm.controls.name.value ?? "", id: null }
        this.conService.POST<ProjectResponse>(api_endpoints.project, JSON.stringify(project)).subscribe(res => {
            this.dataShare.SetProjectList([...this.dataShare.GetProjectList(), res])
            this.activeModal.close()
        })
    }

    protected UpdateProject() {
        let project: ProjectRequest = { name: this.createProjectForm.controls.name.value ?? "", id: this.createProjectForm.controls.id.value }
        this.conService.PUT<ProjectResponse>(api_endpoints.project, JSON.stringify(project)).subscribe(res => {
            let temp = this.dataShare.GetProjectList()
            temp[temp.findIndex(p => p.id == res.id)] = res
            this.dataShare.SetProjectList([...temp])
            this.activeModal.close()

        })
    }
}
