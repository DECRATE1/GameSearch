using System.Security.Cryptography.X509Certificates;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace igroPoisk.Models;
public class Rate
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id {get; set;}

    public MongoDBRef? UserId {get; set;} = null!;

    public MongoDBRef? GameId {get; set;} = null!;

    public required byte Points {get; set;}

    public required DateTime DateOfRate {get; set;}
}