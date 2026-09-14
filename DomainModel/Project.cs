using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DomainModel
{
    public class Project
    {
        [Key]
        public Guid id { get; set; }
        public string name { get; set; }
        public List<Ticket> tickets { get; set; }
    }
}
