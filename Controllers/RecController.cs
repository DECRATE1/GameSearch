
using System.Security.Claims;
using igroPoisk.Dtos;
using igroPoisk.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.JsonWebTokens;
using MongoDB.Bson;


namespace igroPoisk.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RecController(UserService userService, RatingService ratingService, GameService gameService) : ControllerBase
{
    public UserService _userService = userService;

    public RatingService _ratingService = ratingService;

    public GameService _gameSerivce = gameService;

    [HttpGet("Recommend")]
    [Authorize]
    public async Task<ActionResult> GetRecomendation()
    {
        var token = Request.Headers.Authorization.ToString()["Bearer ".Length..].Trim();
        if(token == null) return Unauthorized("Token is not valid");
        var userId = new JsonWebTokenHandler().ReadJsonWebToken(token).Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)!.Value;
        if(userId == null) return Unauthorized("Token is not valid");
        //Находим id игр которые пользователь оценил
        var likedGameIds = await _ratingService.GetLikedGameIds(userId, 3);
        if(likedGameIds.Count == 0) return Ok(likedGameIds);
        //Находим полные данные по игр по id 
        var getGames = await _gameSerivce.GetGamesAsync(likedGameIds!);
        //Создаем основные метатеги по которым будем сравнивать
        List<MetaTagsDto> metaTags = getGames.Select(g => new MetaTagsDto { id = g.Id!, categories = g.Categories!}).ToList();

        //Находим кондидатов с помощью тегов
        var candidates = await _gameSerivce.FindCandidates(metaTags);
        return Ok(candidates);
    }
}