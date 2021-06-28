const Sequelize = require('sequelize');
//process.env["NODE_CONFIG_DIR"] = __dirname + "/configDir/";
const config = require("config");



const instancia = new Sequelize(
    config.get('mysql.database'),
    config.get('mysql.username'),
    config.get('mysql.password'),
    
    
    {
        port: config.get('mysql.port'),    
        host: config.get('mysql.host'),
        dialect: 'mysql'
    }
    
)

module.exports = instancia

