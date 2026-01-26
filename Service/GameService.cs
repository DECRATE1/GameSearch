using igroPoisk.Dtos;
using igroPoisk.Models;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Any;
using MongoDB.Bson;
using MongoDB.Driver;

namespace igroPoisk.Services;

public class GameService
{
    private readonly IMongoCollection<Game> _gameCollection;

    public GameService(IOptions<DataBaseSettings> gameStoreDatabaseSettings)
    {
      var mongoClient = new MongoClient(gameStoreDatabaseSettings.Value.ConnectionString);
      var mongoDatabase = mongoClient.GetDatabase(gameStoreDatabaseSettings.Value.DatabaseName);
      _gameCollection = mongoDatabase.GetCollection<Game>(gameStoreDatabaseSettings.Value.GameCollection);
    }

    public async Task<Game> GetByIdAsync(string id)
    {
        return await _gameCollection.Find(g => g.Id == id).SingleAsync();
    }

    public async Task<Game?> GetByName(string name)
    {
        var game = await _gameCollection.Find(g => g.Name == name).SingleOrDefaultAsync();
        return game ?? null;
    }

    public async Task<List<Game>> NameSearch(string name)
    {
        var filter = Builders<Game>.Filter.Text(name);
        var projection = Builders<Game>.Projection.MetaTextScore("score").
        Include(g => g.Name).
        Include(g => g.GameId).
        Include(g => g.MetacriticScore).
        Include(g => g.Genres).
        Include(g => g.ImageUrl);

        var findOptions = new FindOptions<Game, Game>
        {
            Projection = projection,
            Sort = Builders<Game>.Sort.MetaTextScore("score"),
            Limit = 5
        };

        var cursor = await _gameCollection.FindAsync(filter, findOptions);
        List<Game> list = await cursor.ToListAsync();
        return list;
    }

    public async Task<List<Game>> GetGamesAsync(List<string> gamesIds)
    {
        var games = await _gameCollection
        .Find(g => gamesIds.Contains(g.Id!)).ToListAsync();
        return games;
    }


    public async Task<List<Game>> FindGamesInDesc(int? page)
    {
        DateTime currDate = DateTime.Now;
        int pageNumber = page ?? 0;
        
        var options = new FindOptions<Game, Game>
        {
            Sort = Builders<Game>.Sort.Descending(g => g.Released),
            Limit = 21,
            Skip = pageNumber * 21
        };
        
        var filter = Builders<Game>.Filter.Lte(g => g.Released, currDate);
        var cursor = await _gameCollection.FindAsync(filter, options);
        List<Game> gamesList = await cursor.ToListAsync();
        
        return gamesList;
    }

    public async Task<List<Game>> FindCandidates(List<MetaTagsDto> metaTags)
    {


        var allCategories = metaTags.Where(m => m.categories != null).SelectMany(m => m.categories).Distinct().ToList();

        var filter = Builders<Game>.Filter.Empty;

        if (allCategories.Count != 0)
            filter &= Builders<Game>.Filter.AnyIn(g => g.Categories, allCategories);

        return await _gameCollection
            .Find(filter)
            .Limit(50)
            .ToListAsync();
    }


    public async Task<List<Game>> FindByDateFilter(string? startDate, string? endDate)
    {
        DateTime start = new();
        DateTime end = new();
        if(!string.IsNullOrEmpty(startDate)) start = DateTime.Parse(startDate);
        if(!string.IsNullOrEmpty(endDate)) end = DateTime.Parse(endDate);

        var filter = Builders<Game>.Filter.And(
            Builders<Game>.Filter.Gte(g => g.Released, start),
            Builders<Game>.Filter.Lte(g => g.Released, end)
        );

        var options = new FindOptions<Game, Game>
        {
            Skip = 10,
            Limit = 10
        };
        var cursor = await _gameCollection.FindAsync(filter, options);
        List<Game> gamesList = await cursor.ToListAsync();
        return gamesList;
    }
    public async Task<long> GetNumberOfGames()
    {
        return await _gameCollection.EstimatedDocumentCountAsync();
    }
}