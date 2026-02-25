import './tariffs';
import './googleSheets';
import env from './env';

console.log('🚀 Сервис запущен');
console.log('📅 Текущая дата:', new Date().toISOString().split('T')[0]);
console.log('🔧 NODE_ENV:', env.NODE_ENV || 'development');