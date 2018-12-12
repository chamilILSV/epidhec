const marketRoutes = require('./market_routes');

module.exports = function(app, db) {
  marketRoutes(app, db);
}
