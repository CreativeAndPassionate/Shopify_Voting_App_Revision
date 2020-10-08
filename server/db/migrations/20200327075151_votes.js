
exports.up = function(knex, Promise) {
  return knex.schema.createTable('votes', (table) => {
    table.increments();
    table.string('product_id').notNullable();
    table.string('customer_id').notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('votes');
};
