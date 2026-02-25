import axios from 'axios';
import db from './db';
import cron from 'node-cron';
import { updateGoogleSheet } from './googleSheets.js';
import env from './env';

const URL = env.URL;
const API_KEY = env.WB_API_KEY;

interface WarehouseItem {
  warehouseName: string;
  geoName: string;
  boxDeliveryBase?: string;
  boxDeliveryLiter?: string;
  boxDeliveryCoefExpr?: string;
  boxStorageBase?: string;
  boxStorageLiter?: string;
  boxStorageCoefExpr?: string;
  boxDeliveryMarketplaceBase?: string;
}

interface TariffRecord {
  date: string;
  warehouse_name: string;
  geo_name: string;
  box_delivery_base: number | null;
  box_delivery_liter: number | null;
  box_delivery_coef_expr: number | null;
  box_storage_base: number | null;
  box_storage_liter: number | null;
  box_storage_coef_expr: number | null;
  box_delivery_marketplace_base: number | null;
}

interface ApiResponse {
  response?: {
    data?: {
      warehouseList?: any[];
    };
  };
}

function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0];
}

function parseNumber(str?: string): number | null {
  if (!str || str === '-') return null;
  return parseFloat(str.replace(',', '.'));
}

export async function fetchAndSaveTariffs(): Promise<void> {
  const date = getCurrentDate();
  console.log(`\n📅 ${date} - Получение тарифов...`);

  try {
    const response = await axios.get<ApiResponse>(URL, {
      params: { date },
      headers: { Authorization: API_KEY },
    });

    const items: WarehouseItem[] = response.data?.response?.data?.warehouseList || [];

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

    await updateGoogleSheet();
  } catch (err: any) {
    console.error('❌ Ошибка:', err.response?.data || err.message);
  }
}

fetchAndSaveTariffs();
cron.schedule('0 * * * *', fetchAndSaveTariffs);
