using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Dating.API.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace Dating.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllers();
            services.AddDbContext<DataContext>(x => x.UseSqlite(Configuration.GetConnectionString("SqliteConnection")));
            services.AddCors(); // order is not matter , complie doesn't care about it

            // Scoped create single instance for every http request but uses the same instance for the http request, act as singleton 
            //Other Than scoped, Transist- One instance every http request, Singleton creates one instance application cycle
            services.AddScoped<IAuthRepository, AuthRepository>();

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>{
                       options.TokenValidationParameters = new TokenValidationParameters{
                           ValidateIssuerSigningKey = true, //secret key validate
                           IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.GetSection("AppSettings:Token").Value)), // key to decrpty
                           ValidateAudience = false, // Roles like admin, user
                           ValidateIssuer = false  // webiste or server address
                       };                        
                    });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage(); // During development mode, When exception is occurred it will return as page when access the webapi
            }                                    // In production Mode, it won't show the page instead of shows - page not working & 500 error
                                                 // To change the value to prodcution Go To launchsettings.json --> environmentVariables --> ASPNETCORE_ENVIRONMENT --> "Production"

            app.UseCors(x =>x.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());// Order is matter in config
            app.UseAuthentication();
           // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
