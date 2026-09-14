using DTO;
using Microsoft.AspNetCore.Mvc;
using Services;

namespace ToDoApp.Server.Controllers
{
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly SvcProject _service;

        public ProjectController(SvcProject service)
        {
            _service = service;
        }

        [HttpGet("api/[controller]")]
        public IEnumerable<ProjectResponse> GetAll()
        {
            return _service.GetAll();
        }


        [HttpPost("api/[controller]")]
        public IActionResult Create([FromBody] ProjectRequest newProject)
        {
            if (newProject.id == null)
            {
                ProjectResponse output = _service.Create(newProject);
                return Ok(output);
            }
            return BadRequest();
        }

        [HttpPut("api/[controller]")]
        public IActionResult Update([FromBody] ProjectRequest updateProject)
        {
            if(updateProject.id is not null)
            {
                ProjectResponse output = _service.Update(updateProject);
                return Ok(output);
            }
            return BadRequest();
        }

        [HttpDelete("api/[controller]/{id:guid}")]
        public IActionResult Delete(Guid id)
        {
            if(_service.Delete(id))
            {
                return Ok();
            }
            return NotFound();
        }

    }
}
