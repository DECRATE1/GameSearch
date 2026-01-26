namespace igroPoisk.Models;

public class DataBaseSettings
{
    public string ConnectionString {get; set;} = null!;
    public string DatabaseName {get; set;} = null!;
    public string UserCollection {get; set;} = null!;
    public string GameCollection {get; set;} = null!;
    public string TokenCollection {get; set;} = null!;
    public string RatingCollection {  get; set;} = null!;
}