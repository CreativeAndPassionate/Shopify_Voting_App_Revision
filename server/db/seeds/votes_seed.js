
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('votes').del()
    .then(function () {
      // Inserts seed entries
      return knex('votes').insert([
        {id: 1, product_id: '4703567675525', customer_id: '3101335683205'},
        {id: 2, product_id: '4703691505797', customer_id: '3101335683205'},
        {id: 3, product_id: '4703706546309', customer_id: '3101335683205'},
        {id: 4, product_id: '4703695863941', customer_id: '3101335683205'},
        {id: 5, product_id: '4703699697797', customer_id: '3101335683205'},
        {id: 6, product_id: '4713312944261', customer_id: '3101335683205'},
        {id: 7, product_id: '4713315238021', customer_id: '3101335683205'}
      ]);
    });
};
