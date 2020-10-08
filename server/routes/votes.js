const Router = require('koa-router');
const queries = require('../db/queries/votes');
const { parse } = require('json2csv');

const router = new Router();
const BASE_URL = `/api/votes`;

// router.get(BASE_URL, async (ctx) => {
//   try {
//     const votes = await queries.getAllVotes();
//     ctx.body = {
//       status: 'success',
//       data: votes
//     };
//   } catch (err) {
//     console.log(err)
//   }
// })

router.get(BASE_URL, async (ctx) => {
  try {
    const votes = await queries.getVotes(
      ctx.query.product_id,
      ctx.query.customer_id,
      ctx.query.from,
      ctx.query.to
    );
    ctx.body = {
      status: 'success',
      data: votes
    };
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/csv`, async (ctx) => {
  try {
    const votes = await queries.getVotes(
      ctx.query.product_id,
      ctx.query.customer_id,
      ctx.query.from,
      ctx.query.to
    );
    ctx.body = parse(votes);
    ctx.set('Content-Type', 'text/csv');
    ctx.set('Content-Disposition', 'attachment; filename=\"' + 'download-' + Date.now() + '.csv\"');
  } catch (err) {
    console.log(err)
  }
})

router.get(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const vote = await queries.getSingleVote(ctx.params.id);
    if (vote.length) {
      ctx.body = {
        status: 'success',
        data: vote
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That vote does not exist.'
      };
    }
  } catch (err) {
    console.log(err)
  }
})

router.post(`${BASE_URL}`, async (ctx) => {
  try {
    const vote = await queries.addVote(ctx.request.body);
    if (vote.length) {
      ctx.status = 201;
      ctx.body = {
        status: 'success',
        data: vote
      };
    } else {
      ctx.status = 400;
      ctx.body = {
        status: 'error',
        message: 'Something went wrong.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.put(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const vote = await queries.updateVote(ctx.params.id, ctx.request.body);
    if (vote.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: vote
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That vote does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.delete(`${BASE_URL}/:id`, async (ctx) => {
  try {
    const vote = await queries.deleteVote(ctx.params.id);
    if (vote.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: vote
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That vote does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

router.delete(`${BASE_URL}`, async (ctx) => {
  try {
    const vote = await queries.deleteVotes(ctx.request.body);
    if (vote.length) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        data: vote
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That vote does not exist.'
      };
    }
  } catch (err) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: err.message || 'Sorry, an error has occurred.'
    };
  }
})

module.exports = router;