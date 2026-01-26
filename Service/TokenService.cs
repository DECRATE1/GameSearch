using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using DnsClient.Protocol;
using igroPoisk.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Bson;
using MongoDB.Driver;

namespace igroPoisk.Services;
public class TokenService
{
    private readonly IConfiguration _configuration;
    private readonly IMongoCollection<Token> _tokenCollection;

   public TokenService(IConfiguration configuration, IOptions<DataBaseSettings> tokenStoreDatabaseSettings)
    {
        _configuration = configuration;
        var mongoClient = new MongoClient(tokenStoreDatabaseSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(tokenStoreDatabaseSettings.Value.DatabaseName);
        _tokenCollection = mongoDatabase.GetCollection<Token>(tokenStoreDatabaseSettings.Value.TokenCollection);
        
    }

    public string GenerateAccessToken(string name, string role, string email, string id)
    {
        var claims = new List<Claim> {new(ClaimTypes.Email, email), new(ClaimTypes.Name, name), new (ClaimTypes.Role, role), new (ClaimTypes.NameIdentifier, id)};
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration!.GetSection("TokenParams")["SecretKey"]!));
        var jwt = new JwtSecurityToken(
            issuer: _configuration!.GetSection("TokenParams")["Issuer"],
            audience: _configuration.GetSection("TokenParams")["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(jwt);
    }

    public bool ValidateRefreshToken(string refreshToken, string refreshTokenDb)
    {
        string key = _configuration.GetSection("TokenParams")["SecretKey"]!;
        var validationParams = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration.GetSection("TokenParams")["Issuer"],
            ValidAudience = _configuration.GetSection("TokenParams")["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
        };
        var handler = new JwtSecurityTokenHandler();
        _ = handler.ValidateToken(token: refreshToken, validationParameters: validationParams, out SecurityToken validatedToken) ?? throw new Exception("Token is invalid");

        var readedRefreshTokenDb = handler.ReadJwtToken(refreshTokenDb);

        if(validatedToken.ToString() != readedRefreshTokenDb.ToString()) throw new Exception("Token is not correct");

        if(validatedToken.ValidTo < DateTime.UtcNow) throw new Exception("Token is expired");

        return true;
    }

    public string GenerateRefreshToken(string id){
        Claim[] claims = [new(ClaimTypes.NameIdentifier, id)];
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration!.GetSection("TokenParams")["SecretKey"]!));
        var jwt = new JwtSecurityToken(
            issuer: _configuration!.GetSection("TokenParams")["Issuer"],
            audience: _configuration.GetSection("TokenParams")["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromDays(7)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256));
        var refreshToken = new JwtSecurityTokenHandler().WriteToken(jwt);
        return refreshToken;
    }

    public async Task SaveRefreshTokenAsync(string id, string refreshToken)
    {
        var mongoRef = new MongoDBRef("User", id);
        var filter = Builders<Token>.Filter.Eq(t => t.UserId, mongoRef);
        var tokenIsExist = await _tokenCollection.Find(filter).FirstOrDefaultAsync();
        Token token = new() {RefreshToken = refreshToken, UserId = mongoRef};
        try{
            if(tokenIsExist == null)
            {
                _tokenCollection.InsertOne(token);
                return;
            }
            else
            {
                var updateFilter = Builders<Token>.Filter.Eq(t => t.UserId, tokenIsExist.UserId);
                var update = Builders<Token>.Update.Set(t => t.RefreshToken, refreshToken);
                _tokenCollection.UpdateOne(filter, update);
                return;
            }
        }catch(Exception ex)
        {
            Console.WriteLine(ex);
            throw new Exception(ex + "");
        }
    }

    public async Task<string> FindRefreshTokenAsync(string userid)
    {
        var mongoRef = new MongoDBRef("User", userid);
        var filter = Builders<Token>.Filter.Eq(t => t.UserId, mongoRef);
        var refreshToken = await _tokenCollection.Find(filter).FirstOrDefaultAsync();
        return refreshToken.RefreshToken!;
    }

    public string RevokeToken(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var accessToken = handler.ReadJwtToken(token);
        var claims = accessToken.Claims;
        try
        {
            string email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)!.Value;
            return email;
        }catch(Exception ex)
        {
            Console.WriteLine(ex);
        }
        return "";
    }
    
}