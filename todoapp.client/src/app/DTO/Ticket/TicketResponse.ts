export interface TicketResponse {
    id: number
    title: string
    description: string | null
    status: number
    createdon: Date
    finishedby: Date
    finishedon: Date
    projectid: string
}
