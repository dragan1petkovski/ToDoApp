using Serilog;
using Microsoft.EntityFrameworkCore;
using DBLayer;
using Services;
namespace ToDoApp.Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            string connectionstring = builder.Configuration.GetSection("ConnectionStrings").GetSection("sqlConnection").Value;

            Log.Logger = new LoggerConfiguration()
            .ReadFrom.Configuration(builder.Configuration)
            .Enrich.FromLogContext()
            .CreateLogger();

            builder.Host.UseSerilog();

            builder.Services.AddDbContext<MSSQLDB>(option => option.UseSqlServer(connectionstring));
            
            builder.Services.AddControllers();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors();
            builder.Services.AddOpenApi();

            builder.Services.AddSerilog(Log.Logger);
            builder.Services.AddScoped<SvcProject>();
            builder.Services.AddScoped<SvcTicket>();

            var app = builder.Build();

            app.UseDefaultFiles();
            app.UsePathBase("/api");


            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.MapControllers();

            app.MapFallbackToFile("/index.html");

            app.Run();
        }
    }
}
