using igroPoisk.Dtos;
using igroPoisk.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace igroPoisk.Services;
public class RatingService
{
    private readonly IMongoCollection<Rate> _ratingCollection;
    public RatingService(IOptions<DataBaseSettings> ratingStoreDatabaseSettings)
    {
    
      var mongoClient = new MongoClient(ratingStoreDatabaseSettings.Value.ConnectionString);
      var mongoDatabase = mongoClient.GetDatabase(ratingStoreDatabaseSettings.Value.DatabaseName);
      _ratingCollection = mongoDatabase.GetCollection<Rate>(ratingStoreDatabaseSettings.Value.RatingCollection);
    
    }

    public async Task<bool> RateGame(string userId, string gameId, byte points)
    {
        var userRef = new MongoDBRef("User", userId);
        var gameRef = new MongoDBRef("Game", gameId);
        var isRated = await _ratingCollection.Find(r => r.UserId!.Id == userId && r.GameId!.Id == gameId).FirstOrDefaultAsync();
        if(isRated != null)
        {
            var update = Builders<Rate>.Update.Set(r => r.Points, points);
            await _ratingCollection.UpdateOneAsync(r => r.UserId!.Id == userId && r.GameId!.Id == gameId, update);
            return true;
        }
        Rate rate = new () {UserId = userRef, GameId = gameRef, Points=points, DateOfRate = DateTime.Now};
        await _ratingCollection.InsertOneAsync(rate);
        return true;
    }

    
    public async Task<List<GameRatedDto>> GetRatedGames(string userid)
    {
        var userRef = new MongoDBRef("User", userid);
        var filter = Builders<Rate>.Filter.Eq(t => t.UserId, userRef);
        var games = await _ratingCollection.Find(filter).ToListAsync();
        var gamesInfo = games.Select(g =>
            new GameRatedDto {GameId = g.GameId!.Id.ToString(), Points = g.Points.ToString()}
        ).ToList();
        return gamesInfo;
    }

    public async Task<List<string?>> GetUserGamesIds(string userid)
    {
        var filter = Builders<Rate>.Filter.Eq(r => r.UserId!.Id, userid);
        var cursor = await _ratingCollection.FindAsync(filter);
        var gamesList = await cursor.ToListAsync();
        List<string?> gameids = [.. gamesList.Select(r => r.GameId!.Id.ToString())];
        return gameids;
    }

    /*public async Task<List<IGrouping<string, MatchingDto>>> GetMatchingUsers(List<string> gamesIds, string ownerId)
    {
        var filter = Builders<Rate>.Filter.Where(r => gamesIds.Contains(r.GameId!.Id.ToString()!) && r.UserId!.Id.ToString() != ownerId);
        var option = new FindOptions<Rate, Rate>
        {
            Limit = 100
        };
        var matchingRates = await _ratingCollection.FindAsync(filter, option);
        var matchingRatesList = await matchingRates.ToListAsync();
        var matchingUsers = matchingRatesList.Select(r => new MatchingDto {
        UserId = r.UserId!.Id.ToString()!, 
        GameId = r.GameId!.Id.ToString()!, 
        Points = r.Points.ToString()}).ToList();
        return matchingUsers.GroupBy(r => r.UserId).Where(g => g.Count() >= 2).ToList();
    }*/

    public async Task<List<string?>> GetLikedGameIds(string userId, int limit)
    {
        var builder = Builders<Rate>.Filter;
        var filter = builder.And(builder.Eq(r => r.UserId!.Id, userId), builder.Gte(r => r.Points, 8));
        var options = new FindOptions<Rate, Rate>
        {
            Limit = limit,
            Sort = Builders<Rate>.Sort.Descending(r => r.DateOfRate),
        };
        var games = await _ratingCollection.FindAsync(filter, options);
        var gamesList = await games.ToListAsync();
        return gamesList.Select(r => r.GameId!.Id.ToString()).ToList();
    }
}