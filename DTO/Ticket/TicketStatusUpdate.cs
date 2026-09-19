using DomainModel;

namespace DTO
{
    public class TicketStatusUpdate
    {
        public long ticketId { get; set; }
        public Guid projectId { get; set; }

        public TicketStatusEnum status { get; set; }
    }
}
