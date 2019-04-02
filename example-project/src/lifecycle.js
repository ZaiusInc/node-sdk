// TBD
module.exports.onInstall((context) => {
  //do install stuff like register webhooks
  //context will contain installation meta like app_id, app_version, customer_id
});

module.exports.onUninstall((context) => {
  //do uninstall stuff
  //context will contain installation meta like app_id, app_version, customer_id
});

module.exports.onUpgrade((context) => {
  //do upgrade stuff
  //context will contain installation meta like app_id, app_version, customer_id
});
