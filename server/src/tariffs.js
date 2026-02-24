// const axios = require('axios');
// const db = require('./db.js');
// const cron = require('node-cron');
// const { updateGoogleSheet } = require('./googleSheets.js');
// const env = require('./env.js');

// const URL = env.URL;
// const API_KEY = env.WB_API_KEY;

// function getCurrentDate(): string {
//   return new Date().toISOString().split('T')[0];
// }

// function parseNumber(str?: string): number | null {
//   if (!str || str === '-') return null;
//   return parseFloat(str.replace(',', '.'));
// }

// interface WarehouseItem {
//   warehouseName: string;
//   geoName: string;
//   boxDeliveryBase?: string;
//   boxDeliveryLiter?: string;
//   boxDeliveryCoefExpr?: string;
//   boxStorageBase?: string;
//   boxStorageLiter?: string;
//   boxStorageCoefExpr?: string;
//   boxDeliveryMarketplaceBase?: string;
// }

// export async function fetchAndSaveTariffs(): Promise<void> {
//   const date = getCurrentDate();
//   console.log(`\n📅 ${date} - Получение тарифов...`);

//   try {
//     const response = await axios.get(URL, {
//       params: { date },
//       headers: { Authorization: API_KEY },
//     });

//     const items: WarehouseItem[] = response.data?.response?.data?.warehouseList || [];

//     if (!items.length) {
//       console.log('❌ Нет данных');
//       return;
//     }

//     const records = items.map((item) => ({
//       date,
//       warehouse_name: item.warehouseName,
//       geo_name: item.geoName,
//       box_delivery_base: parseNumber(item.boxDeliveryBase),
//       box_delivery_liter: parseNumber(item.boxDeliveryLiter),
//       box_delivery_coef_expr: parseNumber(item.boxDeliveryCoefExpr),
//       box_storage_base: parseNumber(item.boxStorageBase),
//       box_storage_liter: parseNumber(item.boxStorageLiter),
//       box_storage_coef_expr: parseNumber(item.boxStorageCoefExpr),
//       box_delivery_marketplace_base: parseNumber(item.boxDeliveryMarketplaceBase),
//     }));

//     await db('warehouse_tariffs')
//       .insert(records)
//       .onConflict(['date', 'warehouse_name'])
//       .merge();

//     console.log(`✅ Сохранено ${records.length} записей`);

//     setTimeout(updateGoogleSheet, 10000);
//   } catch (err: any) {
//     console.error('❌ Ошибка:', err.response?.data || err.message);
//   }
// }

// fetchAndSaveTariffs();
// cron.schedule('0 * * * *', fetchAndSaveTariffs);

const axios = require('axios');
const db = require('./db.js');
const cron = require('node-cron');
const { updateGoogleSheet } = require('./googleSheets.js');
const env = require('./env.js');

const { URL } = env;
const API_KEY = env.WB_API_KEY;

function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

function parseNumber(str) {
  if (!str || str === '-') return null;
  return parseFloat(str.replace(',', '.'));
}

async function fetchAndSaveTariffs() {
  const date = getCurrentDate();
  console.log(`\n📅 ${date} - Получение тарифов...`);

  try {
    const response = await axios.get(URL, {
      params: { date },
      headers: { Authorization: API_KEY },
    });

    const items = response.data?.response?.data?.warehouseList || [];

    if (!items.length) {
      console.log('❌ Нет данных');
      return;
    }

    const records = items.map((item) => ({
      date,
      warehouse_name: item.warehouseName,
      geo_name: item.geoName,
      box_delivery_base: parseNumber(item.boxDeliveryBase),
      box_delivery_liter: parseNumber(item.boxDeliveryLiter),
      box_delivery_coef_expr: parseNumber(item.boxDeliveryCoefExpr),
      box_storage_base: parseNumber(item.boxStorageBase),
      box_storage_liter: parseNumber(item.boxStorageLiter),
      box_storage_coef_expr: parseNumber(item.boxStorageCoefExpr),
      box_delivery_marketplace_base: parseNumber(item.boxDeliveryMarketplaceBase),
    }));

    await db('warehouse_tariffs')
      .insert(records)
      .onConflict(['date', 'warehouse_name'])
      .merge();

    console.log(`✅ Сохранено ${records.length} записей`);

    setTimeout(updateGoogleSheet, 10000);
  } catch (err) {
    console.error('❌ Ошибка:', err.response?.data || err.message);
  }
}

fetchAndSaveTariffs();
cron.schedule('0 * * * *', fetchAndSaveTariffs);

module.exports = { fetchAndSaveTariffs };
