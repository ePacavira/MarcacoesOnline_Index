public class User
{
    public int Id { get; set; }
    public string NomeCompleto { get; set; }
    public string Email { get; set; }
    public string NumeroUtente { get; set; }
    public string? Telefone { get; set; }
    public string? Telemovel { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Genero { get; set; }
    public string? Endereco { get; set; }
    public string? Morada { get; set; }
    public int Perfil { get; set; }
    public string? FotoPath { get; set; } // Campo para o caminho da foto
    public DateTime CreatedOn { get; set; }
    public DateTime? UpdatedOn { get; set; }
} 