namespace igroPoisk.Dtos;

public record NameDto(string Name);

public class UserDto
{
    public string? Name {get; set;} = null!;
    public string? Email {get; set;} = null!;
    public string? Password {get; set;} = null!;
}

public class LoginDto
{
    public string? Email {get; set;} = null!;
    public string Password {get; set;} = null!; 
}