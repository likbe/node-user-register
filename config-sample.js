var config = {}

config.node = {};
config.mongodb = {};
config.redis = {};
config.mandrill = {};
config.monitoring = {};
config.mail = {};

config.node.host = process.env.NODE_HOST || 'localhost';
config.node.port = process.env.NODE_PORT || '8888';

config.mongodb.host = process.env.MONGODB_HOST || 'localhost';
config.mongodb.port = process.env.MONGODB_PORT || '27017';
config.mongodb.user = process.env.MONGODB_USER || '';
config.mongodb.password = process.env.MONGODB_PASSWORD || '';
config.mongodb.database = process.env.MONGODB_DATABASE || 'users';

config.redis.host = process.env.REDIS_HOST || 'localhost';
config.redis.port = process.env.REDIS_PORT || '6379';
config.redis.secret = process.env.REDIS_SECRET || 'REPLACE WITH YOUR REDIS SECRET';
config.redis.prefix = process.env.REDIS_PREFIX || 'session';

config.mail.host = "REPLACE WITH DNS(:PORT)";

config.mandrill.apiKey = process.env.MANDRILL_APIKEY || 'REPLACE WITH YOUR MANDRILL API KEY';

config.monitoring.socketMessage = "REPLACE WITH A SECRET PASSPHRASE";

module.exports = config;