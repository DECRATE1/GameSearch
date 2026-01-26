using DnsClient.Protocol;
using igroPoisk.Models;
using igroPoisk.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace igroPoisk.Controllers;
[ApiController]
[Route("api/[controller]")]
public class GameController(GameService gameService): ControllerBase
{
    private readonly GameService _gameService = gameService;

    [HttpGet("GetByGameId/{id}")]
    public async Task<ActionResult<List<Game>>> GetByGameId([FromRoute] string id)
    {
       Game game = await _gameService.GetByIdAsync(id);
       return Ok(game);
    } 

    [Authorize]
    [HttpGet("GetByName/{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        Game? game = await _gameService.GetByName(name);
        if (game != null)
        {
            return Ok(game);
        }
        return NotFound("Game not found");
    }

    [HttpGet("FindByName")]
    public async Task<ActionResult<List<Game>>> FindByName([FromQuery] string name)
    {
        List<Game> games = await _gameService.NameSearch(name);
        if(games != null)
        {
            return Ok(games);
        }
        return NotFound("Game not found");
    }

    [HttpGet("GetLast")]
    public async Task<ActionResult<List<Game>>> GetLast([FromQuery] int? page)
    {
        List<Game> games = await _gameService.FindGamesInDesc(page);
        return Ok(games);
    }

    [HttpGet("FindByDate")]
    public async Task<ActionResult<List<Game>>> FindByDate([FromQuery] string? startDate, [FromQuery] string? endDate)
    {
        List<Game> games = await _gameService.FindByDateFilter(startDate, endDate);
        return Ok(games);
    }

    [HttpGet("GetNumberOFGames")]
    public async Task<ActionResult> GetNumberOfGames()
    {
        long number = await _gameService.GetNumberOfGames();
        return Ok(number);
    }
}