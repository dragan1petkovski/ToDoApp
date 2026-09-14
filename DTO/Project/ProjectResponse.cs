using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO
{
    public class ProjectResponse
    {
        public Guid id { get; set; }
        
        public string name { get; set; }
    }
}
