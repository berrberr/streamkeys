const _ = require("lodash");

var aliases = [
  ["somealiasone", "somealiasmultiple", "anotheralas"],
  ["multiple.domain.alias.com"]
];

var siteData = {
  siteNames: [
    "atestsitefortestingsitematches",
    "acustomcontrollersite",
    "ablacklistsite",
    "analiasedsite"
  ],

  siteUrls: [
    "http://atestsitefortestingsitematches.com",
    "http://www.acustomcontrollersite.fm",
    "http://play.ablacklistsite.ca",
    "http://music.analiasedsite.xyz"
  ],

  controllerNames: [
    "AtestsitefortestingsitematchesController.js",
    "OVERRIDE.js",
    "ANOTHEROVERRIDE.js",
    "AnaliasedsiteController.js"
  ],

  aliases: aliases,

  aliasUrls: [
    "http://" + aliases[0][0] + ".com",
    "http://www." + aliases[0][1] + ".fm",
    "http://withsubdomain." + aliases[0][2] + ".music",
    "http://" + aliases[1][0] + ".com"
  ],

  blacklists: [
    ["atestsitefortestingsitematches.BLACKLISTDOMAIN", "SUBDOMAINBLACKLIST.atestsitefortestingsitematches"],
    ["MULTIPLE.acustomcontrollersite.DOMAINS"]
  ],

  blacklistUrls: [
    "http://www.atestsitefortestingsitematches.BLACKLISTDOMAIN.com",
    "http://SUBDOMAINBLACKLIST.atestsitefortestingsitematches.fm",
    "http://www.MULTIPLE.acustomcontrollersite.DOMAINS"
  ],

  mockedSites: { }
}

// since url are caseinsensitive
siteData.blacklists = _.map(siteData.blacklists, function(arr) {
  return _.map(arr, _.toLower);
});
siteData.blacklistUrls = _.map(siteData.blacklistUrls, _.toLower);

siteData.siteNames.forEach(function(siteName, i) {
  siteData.mockedSites[siteName] = {
    name: siteName,
    url: siteData.siteUrls[i],
    controller: siteData.controllerNames[i],
    alias: siteData.aliases[i] || "",
    blacklist: siteData.blacklists[i] || ""
  };
});

module.exports = siteData;
