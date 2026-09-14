using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace DTO
{
    public class ProjectRequest
    {
        public Guid? id {  get; set; }
        [RegularExpression(@"^[A-Za-z0-9 ]*$")]
        public string name { get; set; }
    }
}
