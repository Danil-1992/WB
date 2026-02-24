// import { google } from 'googleapis';
// import path from 'path';
// import cron from 'node-cron';
// import db from './db.js';
// import env from './env.js';

// const { google } = require('googleapis');
// const path = require('path');
// const cron = require('node-cron');
// const db = require('./db.js');
// const env = require('./env.js');

// interface TariffRecord {
//   date: string;
//   warehouse_name: string;
//   geo_name: string;
//   box_delivery_base: number | null;
//   box_delivery_liter: number | null;
//   box_delivery_coef_expr: number | null;
//   box_storage_base: number | null;
//   box_storage_liter: number | null;
//   box_storage_coef_expr: number | null;
//   box_delivery_marketplace_base: number | null;
// }

// export async function updateGoogleSheet(): Promise<void> {
//   const date = new Date().toISOString().split('T')[0];

//   try {
//     console.log(`\n📊 Обновление Google Sheets за ${date}...`);

//     const tariffs: TariffRecord[] = await db('warehouse_tariffs')
//       .where({ date })
//       .orderBy('warehouse_name');

//     console.log(`📦 Найдено ${tariffs.length} записей в БД`);

//     if (!tariffs.length) {
//       console.log(`📭 Нет данных за ${date} в БД`);
//       return;
//     }

//     const auth = new google.auth.GoogleAuth({
//       keyFile: path.join(__dirname, '../credentials.json'),
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const authClient = await auth.getClient();

//     const sheets = google.sheets({
//       version: 'v4',
//       auth: authClient as any,
//     });

//     const headers = [
//       'Дата',
//       'Склад',
//       'Регион',
//       'Доставка база',
//       'Доставка литр',
//       'Доставка коэф',
//       'Хранение база',
//       'Хранение литр',
//       'Хранение коэф',
//       'Маркетплейс доставка',
//     ];

//     const rows = tariffs.map((t: TariffRecord) => [
//       t.date,
//       t.warehouse_name,
//       t.geo_name,
//       t.box_delivery_base,
//       t.box_delivery_liter,
//       t.box_delivery_coef_expr,
//       t.box_storage_base,
//       t.box_storage_liter,
//       t.box_storage_coef_expr,
//       t.box_delivery_marketplace_base,
//     ]);

//     const values = [headers, ...rows];

//     await sheets.spreadsheets.values.clear({
//       spreadsheetId: env.SPREADSHEET_ID,
//       range: 'stocks_coefs!A:J',
//     });

//     await sheets.spreadsheets.values.update({
//       spreadsheetId: env.SPREADSHEET_ID,
//       range: 'stocks_coefs!A1',
//       valueInputOption: 'RAW',
//       requestBody: { values },
//     });

//     console.log(`✅ Google Sheets обновлена: ${tariffs.length} записей`);
//   } catch (err: any) {
//     console.error('❌ Ошибка Google Sheets:', err.message);
//   }
// }

// cron.schedule('5 * * * *', updateGoogleSheet);

const { google } = require('googleapis');
const path = require('path');
const cron = require('node-cron');
const db = require('./db.js');
const env = require('./env.js');

async function updateGoogleSheet() {
    const date = new Date().toISOString().split('T')[0];
    
    try {
        console.log(`\n📊 Обновление Google Sheets за ${date}...`);

        const tariffs = await db('warehouse_tariffs')
            .where({ date })
            .orderBy('warehouse_name');

        console.log(`📦 Найдено ${tariffs.length} записей в БД`);

        if (!tariffs.length) {
            console.log(`📭 Нет данных за ${date} в БД`);
            return;
        }

        const auth = new google.auth.GoogleAuth({
            keyFile: path.join(__dirname, '../credentials.json'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const headers = [
            'Дата',
            'Склад',
            'Регион',
            'Доставка база',
            'Доставка литр',
            'Доставка коэф',
            'Хранение база',
            'Хранение литр',
            'Хранение коэф',
            'Маркетплейс доставка'
        ];

        const rows = tariffs.map(t => [
            t.date,
            t.warehouse_name,
            t.geo_name,
            t.box_delivery_base,
            t.box_delivery_liter,
            t.box_delivery_coef_expr,
            t.box_storage_base,
            t.box_storage_liter,
            t.box_storage_coef_expr,
            t.box_delivery_marketplace_base
        ]);

        const values = [headers, ...rows];

        await sheets.spreadsheets.values.clear({
            spreadsheetId: env.SPREADSHEET_ID,
            range: 'stocks_coefs!A:J'
        });

        await sheets.spreadsheets.values.update({
            spreadsheetId: env.SPREADSHEET_ID,
            range: 'stocks_coefs!A1',
            valueInputOption: 'RAW',
            requestBody: { values }
        });

        console.log(`✅ Google Sheets обновлена: ${tariffs.length} записей`);

    } catch (err) {
        console.error('❌ Ошибка Google Sheets:', err.message);
    }
}


cron.schedule('5 * * * *', updateGoogleSheet);

module.exports = { updateGoogleSheet };
