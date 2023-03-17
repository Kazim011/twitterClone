/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (tbl) => {
      tbl.increments("user_id");
      tbl.string("name", 128).notNullable();
      tbl.string("surname", 128).notNullable();
      tbl.string("email", 128).notNullable().unique();
      tbl.string("password", 128).notNullable();
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
    })

    .createTable("tweets", (tbl) => {
      tbl.increments("tweet_id");
      tbl.string("text").notNullable();
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl.timestamp("created_at").defaultTo(knex.fn.now());
    })

    .createTable("comments", (tbl) => {
      tbl.increments("comment_id");
      tbl.string("content").notNullable();
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
      tbl
        .integer("tweet_id")
        .unsigned()
        .notNullable()
        .references("tweet_id")
        .inTable("tweets")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("comments")
    .dropTableIfExists("tweets")
    .dropTableIfExists("users");
};
