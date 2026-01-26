using MongoDB.Bson.Serialization.Attributes;

namespace igroPoisk.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]
    public string? Id {get; set;}
    public string? Name {get; set;} = null!;
    public string? Email {get; set;} = null!;
    public string? Password {get; set;} = null!;
    public DateTime? DateOfRegistration {get; set;} = null!;
    public string? Role {get; set;} = null!;
    public string? Avatar {get; set;} = null!;
}