using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IWebHostEnvironment _environment;
    private readonly IUserService _userService;

    public UserController(IWebHostEnvironment environment, IUserService userService)
    {
        _environment = environment;
        _userService = userService;
    }

    // Upload de foto de perfil
    [HttpPost("{userId}/foto")]
    public async Task<IActionResult> UploadPhoto(int userId, IFormFile file)
    {
        try
        {
            // Verificar se o utilizador existe
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("Utilizador não encontrado");

            // Verificar se o utilizador logado é o mesmo que está a fazer upload
            var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
            if (currentUserId != userId)
                return Forbid("Não tem permissão para alterar este perfil");

            // Validar arquivo
            if (file == null || file.Length == 0)
                return BadRequest("Nenhum arquivo foi enviado");

            // Validar tamanho (máx 2MB)
            if (file.Length > 2 * 1024 * 1024)
                return BadRequest("Arquivo muito grande. Máximo 2MB permitido");

            // Validar tipo
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            if (!allowedTypes.Contains(file.ContentType.ToLower()))
                return BadRequest("Tipo de arquivo não suportado. Use JPG, PNG ou GIF");

            // Criar diretório se não existir
            var uploadsPath = Path.Combine(_environment.WebRootPath, "uploads", "photos");
            if (!Directory.Exists(uploadsPath))
                Directory.CreateDirectory(uploadsPath);

            // Gerar nome único para o arquivo
            var fileName = $"user_{userId}_{DateTime.Now:yyyyMMddHHmmss}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(uploadsPath, fileName);

            // Salvar arquivo
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Atualizar caminho da foto no utilizador
            var photoUrl = $"/uploads/photos/{fileName}";
            await _userService.UpdateUserPhotoAsync(userId, photoUrl);

            return Ok(new { fotoPath = photoUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }

    // Remover foto de perfil
    [HttpDelete("{userId}/foto")]
    public async Task<IActionResult> RemovePhoto(int userId)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
                return NotFound("Utilizador não encontrado");

            // Verificar permissões
            var currentUserId = int.Parse(User.FindFirst("userId")?.Value);
            if (currentUserId != userId)
                return Forbid("Não tem permissão para alterar este perfil");

            // Remover arquivo se existir
            if (!string.IsNullOrEmpty(user.FotoPath))
            {
                var filePath = Path.Combine(_environment.WebRootPath, user.FotoPath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            // Limpar caminho da foto no utilizador
            await _userService.UpdateUserPhotoAsync(userId, null);

            return Ok(new { message = "Foto removida com sucesso" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Erro interno: {ex.Message}");
        }
    }
} 