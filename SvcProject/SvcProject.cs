using DBLayer;
using DomainModel;
using DTO;
using Serilog;
namespace Services
{
    public class SvcProject
    {
        private readonly MSSQLDB _db;
        private readonly ILogger _logger;

        public SvcProject(MSSQLDB db, ILogger logger)
        {
            _db = db;
            _logger = logger;
        }

        public IEnumerable<ProjectResponse> GetAll()
        {
            return _db.projects.Select(p => new ProjectResponse()
            {
                id = p.id,
                name = p.name,
            });
        }

        public ProjectResponse Create(ProjectRequest newProject)
        {
            Project project = new Project()
            {
                id = Guid.NewGuid(),
                name = newProject.name,
                tickets = new List<Ticket>()
            };
            try
            {
                _db.projects.Add(project);
                _db.SaveChanges();
                return new ProjectResponse() { id= project.id, name=project.name };
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot add new Project\n\n{ex.Message}\n\n");
                return null;
            }
        }

        public ProjectResponse Update(ProjectRequest updateProject)
        {
            Project project = _db.projects.Find(updateProject.id);
            if(project is null)
            {
                return null;
            }
            project.name = updateProject.name;

            try
            {
                _db.projects.Update(project);
                _db.SaveChanges();
                return new ProjectResponse() { id = project.id, name = project.name};
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot update the Project {project.id}\n\n{ex.Message}\n\n");
                return null;
            }

        }

        public bool Delete(Guid id)
        {
            Project project = _db.projects.Find(id);
            if( project is null )
            {
                return false;
            }
            try
            {
                _db.projects.Remove(project);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot delete the Project {project.id}\n\n{ex.Message}\n\n");
                return false;
            }
        }
    }
}
