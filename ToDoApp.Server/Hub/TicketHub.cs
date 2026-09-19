using DomainModel;
using Microsoft.AspNetCore.SignalR;
using DTO;

using Services;
using System.Text.Json;
namespace ToDoApp.Server
{
    public class TicketHub : Hub
    {
        private readonly SvcTicket _service;

        public TicketHub(SvcTicket service)
        {
            _service = service;
        }
        public async Task UpdateTicketStatus(TicketStatusUpdate ticketStatus) => await Clients.Caller.SendAsync("ResponseStatus", _service.StatusUpdate(ticketStatus));
    }
}
