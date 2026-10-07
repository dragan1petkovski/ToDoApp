
using Microsoft.AspNetCore.Mvc;
using Services;
using DTO;
using DomainModel;

namespace ToDoApp.Server.Controllers
{
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly SvcTicket _service;

        public TicketController(SvcTicket service)
        {
            _service = service;
        }

        [HttpGet("[controller]")]
        public IEnumerable<TicketResponse> Get([FromQuery] Guid projectid, [FromQuery] bool? completed)
        {
            if(completed.HasValue && completed.Value)
            {
                return _service.GetCompletedTicketsByProjectId(projectid);
            }
            else
            {
                return _service.GetTicketsByProjectId(projectid);
            }

        }

        [HttpPost("[controller]")]
        public IActionResult Create([FromBody] TicketRequest newTicket)
        {
            TicketResponse output = _service.Create(newTicket);
            if(output is not null)
            {
                return StatusCode(201, output);
            }
            else
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
            
        }

        [HttpPut("[controller]")]
        public IActionResult Update([FromBody] TicketRequest updateTicket)
        {
            TicketResponse output = _service.Update(updateTicket);
            if (output is not null)
            {
                return StatusCode(200, output);
            }
            else
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
        }


        [HttpDelete("[controller]/{id:long}")]
        public IActionResult Delete(long id)
        {
            if(_service.Delete(id))
            {
                return NoContent();
            }
            else
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable);
            }
        }
    }
}
