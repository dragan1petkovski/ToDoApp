using DBLayer;
using DomainModel;
using DTO;
using Serilog;
namespace Services
{
    public class SvcTicket
    {
        private readonly MSSQLDB _db;
        private readonly ILogger _logger;
        public SvcTicket(MSSQLDB db, ILogger logger)
        {
            _db = db;
            _logger = logger;
        }

        public IEnumerable<TicketResponse> GetAllTickets()
        {
            return _db.tickets.Select(t => new TicketResponse()
            {
                id = t.id,
                title = t.title,
                createdon = t.createdon,
                status = t.status,
                projectid = t.projectid,

                description = t.description,
                finishedby = t.finishedby,
                finishedon = t.finishedon,


            });
        }

        public IEnumerable<TicketResponse> GetAllTicketsByStatus(TicketStatusEnum status)
        {
            return _db.tickets.Where(t => t.status == status).Select(t => new TicketResponse() {
                id = t.id,
                title = t.title,
                createdon = t.createdon,
                status = t.status,
                projectid = t.projectid,

                description = t.description,
                finishedby = t.finishedby,
                finishedon = t.finishedon,
            });
        }
    
        public IEnumerable<TicketResponse> GetTicketsByProjectId(Guid projectId)
        {
            return _db.tickets.Where(t => t.projectid == projectId).Select(t => new TicketResponse()
            {
                id = t.id,
                title = t.title,
                createdon = t.createdon,
                status = t.status,
                projectid = t.projectid,

                description = t.description,
                finishedby = t.finishedby,
                finishedon = t.finishedon,
            });
        }

        public TicketResponse Create(TicketRequest newTicket)
        {
            Ticket ticket = new Ticket()
            {
                title = newTicket.title,
                projectid = newTicket.projectid,
                finishedby = newTicket.finishedby,
                description = newTicket.description,

                status = TicketStatusEnum.New,
                createdon = DateTime.Now,
                finishedon = null
            };
            try
            {
                _db.tickets.Add(ticket);
                _db.SaveChanges();
                return new TicketResponse()
                {
                    id = ticket.id,
                    title = ticket.title,
                    createdon = ticket.createdon,
                    status = ticket.status,
                    projectid = ticket.projectid,
                    finishedby = ticket.finishedby,
                    finishedon = ticket.finishedon,
                    description = ticket.description
                };
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot add new Ticket\n\n{ex.Message}\n\n");
                return null;
            }
            
        }

        public TicketResponse Update(TicketRequest updateTicket)
        {
            Ticket ticket = _db.tickets.Find(updateTicket.id);
            if(ticket is null)
            {
                return null;
            }

            ticket.title = updateTicket.title;
            ticket.projectid = updateTicket.projectid;
            ticket.finishedby = updateTicket.finishedby;
            ticket.description = updateTicket.description;
            
            try
            {
                _db.tickets.Update(ticket);
                _db.SaveChanges();
                return new TicketResponse()
                {
                    id = ticket.id,
                    title = ticket.title,
                    createdon = ticket.createdon,
                    status = ticket.status,
                    projectid = ticket.projectid,
                    finishedby = ticket.finishedby,
                    finishedon = ticket.finishedon,
                    description = ticket.description
                };
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot update the Ticket {ticket.id}\n\n{ex.Message}\n\n");
                return null;
            }
        }

        public bool Delete(long id)
        {
            Ticket ticket = _db.tickets.Find(id);
            if (ticket is null)
            {
                return false;
            }
            try
            {
                _db.tickets.Remove(ticket);
                _db.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error($"Cannot delete the Ticket {ticket.id}\n\n{ex.Message}\n\n");
                return false;
            }
        }
    } 
}
