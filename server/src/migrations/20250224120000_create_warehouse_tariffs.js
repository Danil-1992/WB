exports.up = function(knex) {
  return knex.schema.createTable('warehouse_tariffs', (table) => {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.string('warehouse_name', 255).notNullable();
    table.string('geo_name', 255);
    table.decimal('box_delivery_base', 10, 2);
    table.decimal('box_delivery_liter', 10, 2);
    table.decimal('box_delivery_coef_expr', 10, 2);
    table.decimal('box_storage_base', 10, 2);
    table.decimal('box_storage_liter', 10, 2);
    table.decimal('box_storage_coef_expr', 10, 2);
    table.decimal('box_delivery_marketplace_base', 10, 2);
    table.decimal('box_delivery_marketplace_liter', 10, 2);
    table.decimal('box_delivery_marketplace_coef_expr', 10, 2);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    
    table.unique(['date', 'warehouse_name']);
    
    table.index('date');
    table.index('warehouse_name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('warehouse_tariffs');
};