[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    // Endpoint simples para upload de foto
    [HttpPost("{userId}/foto")]
    public async Task<IActionResult> UploadPhoto(int userId, IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Nenhum arquivo foi enviado");

        if (file.Length > 2 * 1024 * 1024)
            return BadRequest("Arquivo muito grande. Máximo 2MB permitido");

        // Aqui implementarias a lógica para salvar o arquivo
        // Por agora, retornamos uma URL simulada
        var photoUrl = $"/uploads/photos/user_{userId}_{DateTime.Now:yyyyMMddHHmmss}.jpg";
        
        return Ok(new { fotoPath = photoUrl });
    }
} 