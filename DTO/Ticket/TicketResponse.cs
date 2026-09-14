using DomainModel;

namespace DTO
{
    public class TicketResponse
    {
        public long id {  get; set; }
        public string title { get; set; }
        public DateTime createdon { get; set; }
        public TicketStatusEnum status { get; set; }
        public Guid projectid { get; set; }

        public DateTime? finishedby { get; set; }
        public DateTime? finishedon { get; set; }
        public string? description { get; set; }

        
    }
}
