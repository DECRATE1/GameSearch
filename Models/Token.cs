using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace igroPoisk.Models;
public class Token
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id {get; set;}
    public string? RefreshToken {get; set;} = null!;
    public MongoDBRef? UserId {get; set;} = null!;
}