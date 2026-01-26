using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using igroPoisk.Dtos;
using igroPoisk.Models;
using igroPoisk.Services;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;

namespace igroPoisk.Controllers;
[ApiController]
[Route("api/[controller]")]

//Котроллер для авторизации пользователей
public class AuthController(UserService userService, TokenService tokenService): ControllerBase
{
    private readonly UserService _userService = userService;
    private readonly TokenService _tokenService = tokenService;

    [HttpPost("register")]
    public async Task<ActionResult<Dictionary<string, string>>> Register([FromForm] UserDto userForm)
    {
        //Проверка не существует ли пользователь
        if(string.IsNullOrEmpty(userForm.Name) || string.IsNullOrEmpty(userForm.Email) || string.IsNullOrEmpty(userForm.Password)) return BadRequest("Not valid data");
        var userIsExist = await _userService.GetUserByEmailAsync(userForm.Email);
        if(userIsExist != null) return Conflict("User already exist");

        //Регистрируем нового пользователя
        User user = new(){Name = userForm.Name, Email = userForm.Email, Password = userForm.Password};

        //Хешируем пароль
        var hash = _userService.HashPassword(user.Name, user.Password);

        //Проверка на регистрацию администратора
        if(user.Email == "yandovin2005@mail.ru" && user.Name == "DECRATE") user.Role = "Admin";
        else user.Role = "User";


        user.Password = hash;
        user.DateOfRegistration = DateTime.Now;

        //Сохраняем пользователя в БД
        string id = await _userService.CreateUserAsync(user);

        //Создаем accessToken
        string accessToken = _tokenService.GenerateAccessToken(name: user.Name, role: user.Role ?? "User", email: user.Email, id);


        //Создаем refreshToken и сохранем его в БД
        string refreshToken = _tokenService.GenerateRefreshToken(id: id);
        await _tokenService.SaveRefreshTokenAsync(id: id, refreshToken: refreshToken);

        //Записываем refreshToken куки
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions()
        {
           HttpOnly = true,
           SameSite = SameSiteMode.Strict,
           Expires = DateTimeOffset.Now.AddDays(7),
           Path = "/"
        });

        Response.Cookies.Append("username", user.Name, new CookieOptions()
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.Now.AddDays(7),
            Path = "/"
        });


        return Ok(new { accessToken });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromForm] LoginDto loginForm)
    {   
        //Валидация данных
        if(string.IsNullOrEmpty(loginForm.Email) || string.IsNullOrEmpty(loginForm.Password)) return BadRequest("email or password is incorrect");

        //Проверка на сущестрования пользователя
        var userIsExist = await _userService.GetUserByEmailAsync(loginForm.Email);
        if(userIsExist == null) return NotFound("User does not exist");

        //Проверка пароля на валидность
        var passwordIsValid = _userService.VerifyPassword(username: userIsExist.Name!, hashedPassword: userIsExist.Password!, inputPassword: loginForm.Password);
        if(!passwordIsValid) return Unauthorized("email or password is incorrect");

        //Выписываем токены и сохраняем в БД и куки
        string accessToken = _tokenService.GenerateAccessToken(name: userIsExist.Name!, role: userIsExist.Role!, email: userIsExist.Email!, id: userIsExist.Id!);
        string refreshToken = _tokenService.GenerateRefreshToken(id: userIsExist.Id!);
        await _tokenService.SaveRefreshTokenAsync(id: userIsExist.Id!, refreshToken: refreshToken);
        Response.Cookies.Append("refreshToken", refreshToken, new CookieOptions()
        {
           HttpOnly = true,
           SameSite = SameSiteMode.Strict,
           Expires = DateTime.Now.AddDays(7),
            Path = "/"
        });

        Response.Cookies.Append("username", userIsExist.Name!, new CookieOptions()
        {
            HttpOnly = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTimeOffset.Now.AddDays(7),
            Path = "/"
        });


        return Ok(new { accessToken });
    }


    //Выписывем новые токены в случае если accessToken уже истек
    [HttpPost("revokeToken")]
    public async Task<IActionResult> Revoke()
    {
        //Берем accessToken из заголовка
        string tokenRequest = Request.Headers.Authorization.ToString();
        //Берем refreshToken
        var refreshTokenRequest = Request.Cookies["refreshToken"];

        //Проверяем токен
        if(string.IsNullOrEmpty(tokenRequest) || !tokenRequest.StartsWith("Bearer ") || refreshTokenRequest == null)
        {
            //Отправляем на авторизацию
            return Unauthorized("Token is invalid");
        }
        string token = tokenRequest["Bearer ".Length..].Trim();

        //Берем из токена id для поиска
        var handler = new JwtSecurityTokenHandler();
        var accessToken = handler.ReadJwtToken(refreshTokenRequest);
        var claims = accessToken.Claims;
        string id = claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;

        //Ищем пользователя
        User user = await _userService.GetUserByIdAsync(id);
        if(user == null)
        {
            return Unauthorized("Token is invalid and user not found");
        };

        //Берем refreshToken из БД
        var refreshTokenDb = await _tokenService.FindRefreshTokenAsync(id);
        try
        {
            //Проверяем токен на валидность и сходится ли он с тем что записано в бд
            bool res = _tokenService.ValidateRefreshToken(refreshToken: refreshTokenRequest, refreshTokenDb: refreshTokenDb);
            if (res)
            {
                //Если все правильно, выписываем новый accessToken
                string newAccessToken = _tokenService.GenerateAccessToken(name: user.Name!, role: user.Role!, email: user.Email!, id: user.Id!);
                return Ok(new { accessToken = newAccessToken });
            }
            else
            {
                return Unauthorized("Token is invalid");
            }
        }catch(Exception ex)
        {
            Console.WriteLine(ex);
            //В случае ошибки отправляем на авторизацию
            return Unauthorized("Token is invalid");
        }
        
        // handler.ReadJwtToken(await _tokenService.FindRefreshTokenAsync(user.Id!));
    }
    [HttpGet("checkRefreshToken")]
    public async Task<IActionResult> CheckRefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if(string.IsNullOrEmpty(refreshToken)) return Unauthorized("Token is invalid");
        var handler = new JwtSecurityTokenHandler();
        var id = handler.ReadJwtToken(refreshToken).Claims.FirstOrDefault(t => t.Type == ClaimTypes.NameIdentifier)!.Value;
        if(string.IsNullOrEmpty(id)) return Unauthorized("Token is invalid");
        User user = await _userService.GetUserByIdAsync(id);
        
        if(user == null)
        {
            Response.Cookies.Delete("refreshToken");
            return Unauthorized("User not found");
        }

        try
        {
            var refreshTokenDb = await _tokenService.FindRefreshTokenAsync(id);            
            bool isValid = _tokenService.ValidateRefreshToken(refreshToken, refreshTokenDb);
            if (isValid)
            {
                var accessToken = _tokenService.GenerateAccessToken(name: user.Name!, role: user.Role!, email: user.Email!, id: user.Id! );
                return Ok(new { accessToken });
            }
            return Unauthorized("Token is invalid");
        }catch(Exception ex)
        {
            return Unauthorized(ex);
        }

    }
}