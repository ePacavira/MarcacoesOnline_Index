public interface IUserService
{
    Task<User> GetUserByIdAsync(int id);
    Task<User> UpdateUserPhotoAsync(int userId, string? photoPath);
    // Outros métodos...
} 