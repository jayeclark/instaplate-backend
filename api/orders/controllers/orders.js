'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const stripe = require("stripe")("sk_test_51K9s9CKfDYuSYV2wJhFgzn9qJ9Jdslpc7J14zOoxM4yJ6CWOgphptzZzuhqyOGlOrkFIa51USsCOxcmQjHDyt2Ro005QozcPM9");

module.exports = {

  /**
   * Retrieve order records.
   *
   * @return {Object|Array}
   */

   find: async ctx => {
    if (ctx.query._q) {
      return strapi.services.orders.search(ctx.query);
    } else {
      return strapi.services.orders.find(ctx.query);
    }
  },

  /**
   * Retrieve a order record.
   *
   * @return {Object}
   */

  findOne: async ctx => {
    if (!ctx.params._id.match(/^[0-9a-fA-F]{24}$/)) {
      return ctx.notFound();
    }

    return strapi.services.orders.find(ctx.params);
  },

  /**
   * Count order records.
   *
   * @return {Number}
   */

  count: async ctx => {
    return strapi.services.orders.count(ctx.query);
  },

  /**
   * Create a/an order record.
   *
   * @return {Object}
   */

  create: async ctx => {

    const { address, address_line_2, amount, dishes, token, city, state, zip, restaurant_id } = JSON.parse(ctx.request.body);

    const stripeAmount = Math.floor(amount * 100);

    const charge = await stripe.charges.create({
      // Transform cents to dollars.
      amount: stripeAmount,
      currency: "usd",
      description: `Order ${new Date()} by ${ctx.state.user._id}`,
      source: token
    });

    // Register the order in the database
    const order = await strapi.services.orders.add({
      user: ctx.state.user._id,
      address,
      address_line_2,
      amount: stripeAmount,
      dishes,
      city,
      state,
      zip,
      restaurant: restaurant_id,
      charge_id: charge.id
    });

    return order;
  },

  /**
   * Update a/an order record.
   *
   * @return {Object}
   */

  update: async (ctx, next) => {
    return strapi.services.orders.edit(ctx.params, ctx.request.body);
  },

  /**
   * Destroy a/an order record.
   *
   * @return {Object}
   */

  destroy: async (ctx, next) => {
    return strapi.services.orders.remove(ctx.params);
  }
};
