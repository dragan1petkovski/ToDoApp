using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DomainModel
{
    public class Ticket
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long id { get; set; }
        public string title { get; set; }
        public string? description { get; set; }

        public TicketStatusEnum status { get; set; }

        public DateTime createdon { get; set; }
        public DateTime? finishedby { get; set; }

        public DateTime? finishedon { get; set; }
        public Project? project { get; set;  }
        [ForeignKey(nameof(Project))]
        public Guid projectid { get; set; }
    }
}
