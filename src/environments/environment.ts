export const environment = {
  production: false,
  apiUrl: 'https://localhost:7134/api',
  enablePhotoSync: false, // Desativar sincronização se o endpoint não existir
  maxPhotoSize: 2 * 1024 * 1024, // 2MB
  allowedPhotoTypes: ['image/jpeg', 'image/png', 'image/gif']
};
