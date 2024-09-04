const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: "postgres://okbkttfw:TWlQ4xfNDbRAgHIDd0JFK2EneW19Abo6@kiouni.db.elephantsql.com/okbkttfw"
})

module.exports = {
  query: (text, params) => pool.query(text, params)
};
