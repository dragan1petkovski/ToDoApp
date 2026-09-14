
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

        [HttpGet("api/[controller]")]
        public IEnumerable<TicketResponse> Get([FromQuery] int? status)
        {
            if(status is null)
            {
                return _service.GetAllTickets();
            }
            else
            {
                return _service.GetAllTicketsByStatus((TicketStatusEnum)status);
            }
        }

        [HttpGet("api/[controller]")]
        public IEnumerable<TicketResponse> GetTicketByProjectId([FromQuery] Guid projectid)
        {
            return _service.GetTicketsByProjectId(projectid);
        }

        [HttpPost("api/[controller]")]
        public IActionResult Create([FromBody] TicketRequest newTicket)
        {
            return Ok(_service.Create(newTicket));
        }
    }
}
