using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Dating.API.Data;
using Dating.API.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using Serilog.Events;

namespace Dating.API
{
    public class Program
    {
        public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();
        public static void Main(string[] args)
        {
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(Configuration)
                .CreateLogger();
            try
            {
                Log.Information("Starting web host");
                var host = CreateHostBuilder(args).Build();
                using (var scope = host.Services.CreateScope()){

                    var services = scope.ServiceProvider;
                    try
                    {
                        var context = services.GetRequiredService<DataContext>();
                        var userManager = services.GetRequiredService<UserManager<User>>();
                        var roleManager = services.GetRequiredService<RoleManager<Role>>();
                        context.Database.Migrate();
                        Seed.SeedUser(userManager, roleManager);
                    }
                    catch (Exception e)
                    {        
                        Console.WriteLine(e.Message);
                    }
                }
                host.Run();
            }
            catch(Exception ex){
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
               Log.CloseAndFlush(); 
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
