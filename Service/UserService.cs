using System.Threading.Tasks;
using igroPoisk.Dtos;
using igroPoisk.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace igroPoisk.Services;

public class UserService
{
    private readonly PasswordHasher<string> _hasher = new();
    private readonly IMongoCollection<User> _userCollection;

    public UserService(IOptions<DataBaseSettings> userStoreDatabaseSettings)
    {
      var mongoClient = new MongoClient(userStoreDatabaseSettings.Value.ConnectionString);
      var mongoDatabase = mongoClient.GetDatabase(userStoreDatabaseSettings.Value.DatabaseName);
      _userCollection = mongoDatabase.GetCollection<User>(userStoreDatabaseSettings.Value.UserCollection);
    }

    public async Task<User> GetUserByEmailAsync(string email){
        var filter = Builders<User>.Filter.Eq(u => u.Email, email.ToLowerInvariant());
        return await _userCollection.Find(filter).FirstOrDefaultAsync();
    }
        
     
    public async Task<List<User>> GetUsersAsync() =>
        await _userCollection.Find(_ => true).ToListAsync();

    public async Task<User> GetUserByIdAsync(string id)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var projection = Builders<User>.Projection.Exclude(u => u.Password);
        return await _userCollection.Find(filter).Project<User>(projection).FirstOrDefaultAsync();
    }

    public async Task<string> CreateUserAsync(User user)
    {
        await _userCollection.InsertOneAsync(user);
        return user.Id!;
    }

    public async Task<User> GetUserInfoAsync(string id)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var projection = Builders<User>.Projection.Exclude(u => u.Password).Exclude(u => u.Email).Exclude(u => u.Role).Exclude(u => u.Id).Exclude(u => u.Avatar);
        return await _userCollection.Find(filter).Project<User>(projection).FirstOrDefaultAsync();
    }

    public async Task DeleteUserAsync(string id)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        await _userCollection.DeleteOneAsync(filter);
    }

    public async Task UpdateUserAsync(string id, string Name)
    {
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var update = Builders<User>.Update.Set(u => u.Name, Name);
        await _userCollection.UpdateOneAsync(filter, update);
    }

    public string HashPassword(string username, string password)
    {
        return _hasher.HashPassword(username, password);
    }

    public bool VerifyPassword(string username, string hashedPassword, string inputPassword)
    {
        var res = _hasher.VerifyHashedPassword(username, hashedPassword, inputPassword);
        return res == PasswordVerificationResult.Success;
    }

    public async Task AddAvatar(string id, string filePath)
    {
        string url = "http://localhost:3001/" + string.Join("/", filePath.Split("\\")[5..]);
        
        var filter = Builders<User>.Filter.Eq(u => u.Id, id);
        var update = Builders<User>.Update.Set(u => u.Avatar, url);
        await _userCollection.UpdateOneAsync(filter, update);
    }

}