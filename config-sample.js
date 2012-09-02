var config = {}

config.mandrill = {};

config.mandrill.apiKey = process.env.MANDRILL_APIKEY || 'REPLACE BY YOUR API KEY';

module.exports = config;