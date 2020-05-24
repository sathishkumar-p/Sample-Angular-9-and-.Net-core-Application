using System;
using System.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Dating.API.Data;
using Dating.API.Dtos;
using Dating.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

namespace Dating.API.Controllers
{
    [ApiController] // use no need to use FromBody, FromQuery, Validate the model automatic instead using ModelState object
    [Route("api/[controller]")]

    //Controller have MVC, controller base uses API
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly IConfiguration _config;
        public AuthController(IAuthRepository repo, IConfiguration config)
        {
            _config = config;
            _repo = repo;
        }

        [HttpPost("register")]

        public async Task<IActionResult> Register(UserForRegisterDto userForRegisterDto)
        {
            userForRegisterDto.Username = userForRegisterDto.Username.ToLower();

            if (await _repo.UserExists(userForRegisterDto.Username))
                return BadRequest("Username already exits");

            var userToCreate = new User
            {
                Username = userForRegisterDto.Username
            };

            var createdUser = await _repo.Register(userToCreate, userForRegisterDto.Password);

            return StatusCode(201);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserForLoginDto userForLoginDto)
        {
            var userFromRepo = await _repo.Login(userForLoginDto.Username.ToLower(), userForLoginDto.Password);

            if (userFromRepo == null)
                return Unauthorized();

            // JSON Web token standard RFC 7519  token for each api call validation with calling database everytime 
            // It contains three portion 1.header (typeof token, alg used to hash), 2.Payload contains user info, expiry, 3.secret or signature that generated by server
            
            // claims store sensitive information about the user, be careful which type of data using
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userFromRepo.Id.ToString()),
                new Claim(ClaimTypes.Name, userFromRepo.Username)
            };

            //Getting secret key from config file as bytes of symmetric key
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("AppSettings:Token").Value));

            //secret part of token generate with hash alg sha 512
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            //Token formation
            var tokenDescription = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(1),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            //Token creation
            var token = tokenHandler.CreateToken(tokenDescription);

            return Ok(new{
                token = tokenHandler.WriteToken(token)
            });

        }

    }
}