using System.Linq;
using System.Threading.Tasks;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Dating.API.Data;
using Dating.API.Dtos;
using Dating.API.Helpers;
using Dating.API.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace Dating.API.Controllers
{
    [ApiController] // use no need to use FromBody, FromQuery, Validate the model automatic instead using ModelState object
    [Route("api/[controller]")]
    public class AdminController: ControllerBase
    {
        private readonly DataContext _context;

        public UserManager<User> _userManager;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public AdminController(DataContext context, UserManager<User> userManager, IOptions<CloudinarySettings> cloudinaryConfig)
        {
            _context = context;
            _userManager = userManager;
            _cloudinaryConfig = cloudinaryConfig;

            Account acc = new Account(
            _cloudinaryConfig.Value.CloudName,
            _cloudinaryConfig.Value.ApiKey,
            _cloudinaryConfig.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(acc);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("userswithroles")]
        public async Task<IActionResult> GetUserWithRoles(){

            var userList = await _context.Users
                .OrderBy(x => x.UserName)
                .Select(user => new {
                    Id = user.Id,
                    UserName = user.UserName,
                    Roles = (from userRole in user.UserRoles
                                join role in _context.Roles
                                on userRole.RoleId equals role.Id
                                select role.Name).ToList()
                }).ToListAsync();

            return Ok(userList);  

        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("editRoles/{userName}")]

        public async Task<IActionResult> EditRole(string userName, RoleEditDto roleEditDto){
            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);
            var selectedRoles = roleEditDto.RoleNames;

            selectedRoles =  selectedRoles ?? new string[]{};
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if(!result.Succeeded){
                return BadRequest("Failed to add role");
            }
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if(!result.Succeeded){
                return BadRequest("Failed to add role");
            }
            return Ok(await _userManager.GetRolesAsync(user));
        }
        
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photosForModeration")]

        public async Task<IActionResult> GetPhotosForModeration(){
            var photos = await _context.Photos
                .Include(u => u.User)
                .IgnoreQueryFilters()
                .Where(u => u.IsApproved == false)
                .Select(u => new
                {
                    Id = u.Id,
                    UserName = u.User.UserName,
                    Url = u.Url,
                    IsApproved = u.IsApproved
                }).ToListAsync();

                return Ok(photos);
        }
       
        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("approvePhoto/{photoId}")]

        public async Task<IActionResult> ApprovePhoto(int photoId){
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(x => x.Id == photoId);
            photo.IsApproved = true;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPost("rejectPhoto/{photoId}")]

        public async Task<IActionResult> RejectPhoto(int photoId){
            var photo = await _context.Photos
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(x => x.Id == photoId);
            
            if(photo.IsMain)
                return BadRequest("You cannot reject Main photo");
            
            if(photo.PublicId != null){
                var deleteParams = new DeletionParams(photo.PublicId);
                var result = _cloudinary.Destroy(deleteParams);

                if(result.Result == "ok"){
                   _context.Photos.Remove(photo);
                }
            }
            if(photo.PublicId == null){
                _context.Photos.Remove(photo);
            }
            await _context.SaveChangesAsync();
            return Ok();
        }
        

    }
}