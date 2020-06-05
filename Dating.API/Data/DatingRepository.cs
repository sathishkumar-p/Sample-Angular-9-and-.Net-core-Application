using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dating.API.Helpers;
using Dating.API.Models;
using Microsoft.EntityFrameworkCore;

namespace Dating.API.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _context;
        public DatingRepository(DataContext context)
        {
            _context = context;
        }
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<Like> GetLike(int userId, int recipientId)
        {
            return await _context.Likes.FirstOrDefaultAsync(x => x.LikerId == userId && x.LikeeId == recipientId);
        }

        public async Task<Photo> GetMainPhotoForUser(int userId)
        {
            return await _context.Photos.Where(p => p.UserId == userId)
                                        .FirstOrDefaultAsync(p => p.IsMain);
        }

        public async Task<Photo> GetPhoto(int id)
        {
            var photo = await _context.Photos.FirstOrDefaultAsync(p => p.Id == id);
            return photo;
        }

        public async Task<User> GetUser(int id)
        {
            var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.Id == id);
            return user;
        }

        public async Task<PagedList<User>> GetUsers(UserParams userParams)
        {
            var users =  _context.Users.Include(p => p.Photos).OrderByDescending(u => u.LastActive).AsQueryable();
            users = users.Where(u => u.Id != userParams.UserId);
            users = users.Where(u => u.Gender == userParams.Gender);
            if(userParams.Likers){
                var userLikers = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikers.Contains(u.Id));
            }
            if(userParams.Likees){
                var userLikees = await GetUserLikes(userParams.UserId, userParams.Likers);
                users = users.Where(u => userLikees.Contains(u.Id));
            }

            if(userParams.MinAge != 18 || userParams.MaxAge != 99){
                var minDob = DateTime.Today.AddYears(-userParams.MaxAge -1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge);

                users = users.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            }

            if(!string.IsNullOrEmpty(userParams.OrderBy)){
                switch(userParams.OrderBy){
                    case "created":
                        users = users.OrderByDescending(x => x.Created);
                        break;
                    default:
                        users = users.OrderByDescending(x => x.LastActive);
                        break;
                }
            }
            return await PagedList<User>.CreateAsync(users, userParams.PageNumber, userParams.PageSize);
        }
        private async Task<IEnumerable<int>> GetUserLikes(int id, bool likers){
            var user = await _context.Users
                                    .Include(x => x.Likees)
                                    .Include(x => x.Likers)
                                    .FirstOrDefaultAsync(x => x.Id == id);
            
            if(likers){
                return user.Likers.Where(x => x.LikeeId == id).Select(x => x.LikerId);
            }
            else{
                return user.Likees.Where(x => x.LikerId == id).Select(x => x.LikeeId);
            }
        }
        public async Task<bool> SaveAll()
        {
            return await _context.SaveChangesAsync() > 0; // Return if any update or save the data count will be positive 
        }

        public async Task<Message> GetMessage(int id)
        {
            return await _context.Messages.FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task<PagedList<Message>> GetMessagesForUser(MessageParams messageParams)
        {
            var message = _context.Messages
                            .Include(x => x.Sender).ThenInclude(p => p.Photos)
                            .Include(x => x.Recipient).ThenInclude(p => p.Photos)
                            .AsQueryable();
            
            switch (messageParams.MessageContainer){
                case "Inbox":
                     message = message.Where(x => x.RecipientId == messageParams.UserId && x.RecipientDeleted == false);
                     break;
                case "Outbox":
                    message = message.Where(x => x.SenderId == messageParams.UserId && x.SenderDeleted == false);
                    break;
                default:
                    message = message.Where(x => x.RecipientId == messageParams.UserId && x.IsRead == false && x.RecipientDeleted == false);
                    break;
            }

            message = message.OrderByDescending(d=>d.MessageSent);
            return await PagedList<Message>.CreateAsync(message, messageParams.PageNumber, messageParams.PageSize);
        }

        public async Task<IEnumerable<Message>> GetMessageThread(int userId, int recipientId)
        {
            var message = await _context.Messages
                            .Include(x => x.Sender).ThenInclude(p => p.Photos)
                            .Include(x => x.Recipient).ThenInclude(p => p.Photos)
                            .Where(m => m.RecipientId == userId && m.RecipientDeleted == false && m.SenderId == recipientId
                                    || m.RecipientId ==recipientId && m.SenderDeleted == false && m.SenderId == userId)
                            .OrderByDescending(m => m.MessageSent)
                            .ToListAsync();
            
            return message;
        }
    }
}