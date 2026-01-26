using igroPoisk.Dtos;
using igroPoisk.Models;
using igroPoisk.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.OpenApi.Any;
using MongoDB.Bson;
using System.Security.Claims;
using System.Security.Cryptography.X509Certificates;

namespace igroPoisk.Controllers;
[ApiController]
[Route("api/[controller]")]
public class UserController(UserService userService, RatingService ratingService, GameService gameService) : ControllerBase
{
    
    private readonly UserService _userService = userService;
    private readonly RatingService _ratingService = ratingService;
     private readonly GameService _gameService = gameService;
    [Authorize]
    [HttpGet("GetAllUsers")] 
    public async Task<ActionResult<List<User>>> GetAllUsers()
    {
        var users = await _userService.GetUsersAsync();
        return Ok(users);
    }
    [Authorize]
    [HttpGet("GetUserById")]
    public async Task<ActionResult<AnyType>> GetUserById()
    {
        var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
        if(string.IsNullOrEmpty(token)) return Unauthorized("Token is invalid");
        var id = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
        if(string.IsNullOrEmpty(id)) return BadRequest("Something want wrong");
        var user = await _userService.GetUserByIdAsync(id);
        if(user == null)
        {
            return BadRequest("User not found");
        }
        var gamesInfo = await _ratingService.GetRatedGames(userid: id);
        if (gamesInfo.Count == 0 || gamesInfo == null) return Ok(new { user, games = gamesInfo });
        var gamesIds = gamesInfo
        .Select(x => x.GameId)
        .ToList();
        var games = await _gameService.GetGamesAsync(gamesIds!); 
        var gamesInfoList = games.Select((game, index) => new GetManyGamesDto {Game = game, Points = gamesInfo.First(g => g.GameId == game.Id!.ToString()).Points}).ToList();
        return Ok(new {user, games = gamesInfoList});
    }


    [Authorize]
    [HttpDelete("DeleteUser/{id}")]
    public async Task<ActionResult<string>> Delete([FromRoute] string id)
    {
        await _userService.DeleteUserAsync(id);
        return Ok("User deleted");
    }

    [Authorize]
    [HttpPut("AddAvatar")]
    public async Task<ActionResult<bool>> PutAvatar([FromForm] UserAvatarDto formAvatar)
    {
        var avatar = formAvatar.avatar;
        if(avatar != null && avatar.Length > 0)
        {
            var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
            if(token == null) return BadRequest("Token does not exists");
            var id = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
            var fileName = id;
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), @"wwwroot\avatars", fileName + ".png");
            using var fileStream = new FileStream(filePath, FileMode.Create);
            await avatar.CopyToAsync(fileStream);
            await _userService.AddAvatar(id, filePath);
            return Ok(new {isComplete = true});
        }
        return BadRequest(new {isComplete = false});
    }

    [Authorize]
    [HttpPost("RateGame/{GameId}")]
    public async Task<ActionResult<bool>> RateGame([FromRoute] string GameId, [FromBody] RateDto Points)
    {
        var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
        if(token == null) return BadRequest("Token does not exist");
        var UserId = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
        if(UserId == null) return Unauthorized("Token is not valid");
        bool res = await _ratingService.RateGame(gameId: GameId, userId: UserId, points: Points.Points);
        return Ok(res);
    }

    [Authorize]
    [HttpGet("GetRec")]
    public async Task<ActionResult> GetRecomendation()
    {
        var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
        /*if(token == null) return BadRequest("Token does not exist");
        var UserId = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
        if(UserId == null) return Unauthorized("Token is not valid");
        List<string?> gamesIds = await _ratingService.GetUserGamesIds(userid: UserId);
        if(gamesIds.Count == 0) return Ok(gamesIds);
        var matchingUsers = await _ratingService.GetMatchingUsers(gamesIds!, ownerId: UserId);*/
        if(token == null) return BadRequest("Token does not exist");
        var UserId = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
        if(UserId == null) return Unauthorized("Token is not valid");

        return Ok();
    }
}