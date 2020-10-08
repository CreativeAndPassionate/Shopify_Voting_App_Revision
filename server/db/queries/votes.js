const knex = require('../connection');

function getAllVotes() {
  return knex('votes')
  .select('*');
}

function getVotes(product_id, customer_id, from, to) {
  var votes = knex('votes').select('*');
  if (product_id) {
    votes = votes.where({ product_id: product_id });
  }
  if (customer_id) {
    votes = votes.where({ customer_id: customer_id });
  }
  if (from) {
    votes = votes.where('created_at', '>=', from);
  }
  if (to) {
    votes = votes.where('created_at', '<', to);
  }
  return votes;
}

function getSingleVote(id) {
  return knex('votes')
  .select('*')
  .where({ id: parseInt(id) });
}

function addVote(vote) {
  return knex('votes')
  .insert(vote)
  .returning('*');
}

function updateVote(id, vote) {
  return knex('votes')
  .update(vote)
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteVote(id) {
  return knex('votes')
  .del()
  .where({ id: parseInt(id) })
  .returning('*');
}

function deleteVotes(condition) {
  return knex('votes')
  .del()
  .where(condition)
  .returning('*');
}

module.exports = {
  getAllVotes,
  getVotes,
  getSingleVote,
  addVote,
  updateVote,
  deleteVote,
  deleteVotes,
};