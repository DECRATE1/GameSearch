using MongoDB.Bson.Serialization.Attributes;

namespace igroPoisk.Models;

public class Game()
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id {get; set;}
    [BsonElement("AppID")]
    public int GameId {get; set;}
    [BsonElement("Name")]
    public string? Name {get; set;} = null!;
    [BsonElement("Release date")]
    public DateTime? Released {get; set;} = null!;
    [BsonElement("Required age")]
    public int? RequiredAge {get; set;} = null!;
    [BsonElement("DLC count")]
    public int? DLCcount {get; set;} = null!;
    [BsonElement("About the game")]
    public string AboutTheGame {get; set;} = null!;
    [BsonElement("Supported languages")]
    public List<string> SupportedLanguages {get; set;} = null!;
    [BsonElement("Header image")]
    public string? ImageUrl {get; set;} = null!;
    [BsonElement("Windows")]
    public bool? Windows {get; set;} = null!;
    [BsonElement("Mac")]
    public bool? Mac {get; set;} = null!;
    [BsonElement("Linux")]
    public bool? Linux {get; set;} = null!;
    [BsonElement("Website")]
    public string? WebSite {get; set;} = null!;
    [BsonElement("Achievements")]
    public int? Achivements {get; set;} = null!;
    [BsonElement("Notes")]
    public string Notes {get; set;} = null!;
    [BsonElement("Developers")]
    public string? Developers {get; set;} = null!;
    [BsonElement("Categories")]
    public List<string> Categories {get; set;} = null!;
    [BsonElement("Genres")]
    public List<string> Genres {get; set;} = null!;
    [BsonElement("Publishers")]
    public string? Publishers {get; set;} = null!;
    [BsonElement("Metacritic score")]
    public int? MetacriticScore {get; set;} = null!;
    [BsonElement("User score")]
    public int? UserScore {get; set;} = null!;
    [BsonElement("Screenshots")]
    public string? ScreenshotsUrl {get; set;} = null!;
    [BsonElement("Movies")]
    public string? Movies {get; set;} = null!;
    [BsonElement("Tags")]
    public List<string> Tags {get; set;} = null!;
    [BsonElement("score")]
    [BsonIgnoreIfNull]
    public double Score {get; set;}

}