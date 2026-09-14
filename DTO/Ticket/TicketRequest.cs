using System;
using System.Collections.Generic;
using System.Text;

namespace DTO
{
    public class TicketRequest
    {
        public long? id { get; set; }
        public string title { get; set; }
        public Guid projectid { get; set; }
        public DateTime? finishedby { get; set; }
        public string? description { get; set; }
    }
}
