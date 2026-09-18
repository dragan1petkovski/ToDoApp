import { Injectable, WritableSignal, signal } from "@angular/core"
@Injectable({
    providedIn: "root"
})
export class CurrentProject {
    private currentProject: WritableSignal<string> = signal("")

    public GetCurrentProjectId(): string
    {
        return this.currentProject()
    }

    public SetCurrentProjectId(id: string): void
    {
        this.currentProject.set(id)
    }
}
