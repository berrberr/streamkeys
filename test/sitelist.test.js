var Sitelist = require("../code/js/modules/Sitelist.js"),
    _ = require("lodash");

describe("Sitelist tests", function() {
  var sitelist, siteNames, controllerNames, siteUrls,
      aliases, aliasUrls, blacklists, blacklistUrls, tabs;

  beforeAll(function() {
    chrome.storage.local.get.yields({});

    siteNames = [
      "atestsitefortestingsitematches",
      "acustomcontrollersite",
      "ablacklistsite",
      "analiasedsite"
    ];

    siteUrls = [
      "http://atestsitefortestingsitematches.com",
      "http://www.acustomcontrollersite.fm",
      "http://play.ablacklistsite.ca",
      "http://music.analiasedsite.xyz"
    ];

    controllerNames = [
      "AtestsitefortestingsitematchesController.js",
      "OVERRIDE.js",
      "ANOTHEROVERRIDE.js",
      "AnaliasedsiteController.js"
    ];

    aliases = [
      ["somealiasone", "somealiasmultiple", "anotheralas"],
      ["multiple.domain.alias.com"]
    ];

    aliasUrls = [
      "http://" + aliases[0][0] + ".com",
      "http://www." + aliases[0][1] + ".fm",
      "http://withsubdomain." + aliases[0][2] + ".music",
      "http://" + aliases[1][0] + ".com"
    ];

    blacklists = [
      ["atestsitefortestingsitematches.BLACKLISTDOMAIN", "SUBDOMAINBLACKLIST.atestsitefortestingsitematches"],
      ["MULTIPLE.acustomcontrollersite.DOMAINS"]
    ];

    blacklistUrls = [
      "http://www.atestsitefortestingsitematches.BLACKLISTDOMAIN.com",
      "http://SUBDOMAINBLACKLIST.atestsitefortestingsitematches.fm",
      "http://www.MULTIPLE.acustomcontrollersite.DOMAINS"
    ];

    tabs = [
      {
        id: 1,
        title: siteNames[0],
        url: siteUrls[0]
      },
      {
        id: 2,
        title: siteNames[1],
        url: siteUrls[1]
      },
      {
        id: 3,
        title: siteNames[1],
        url: siteUrls[1]
      },
      {
        id: 4,
        title: siteNames[2],
        url: siteUrls[2]
      }
    ];
    chrome.tabs.query.yields(tabs);

    var mockedSites = { };

    for(var i = 0; i < siteNames.length; i++) {
      mockedSites[siteNames[i]] = {
        name: siteNames[i],
        url: siteUrls[i],
        controller: controllerNames[i],
        alias: aliases[i] || "",
        blacklist: blacklists[i] || ""
      };
    }

    sitelist = new Sitelist(mockedSites);
    sitelist.loadSettings();
  });

  it("creates a list of sites", function() {
    expect(sitelist.sites).toBeDefined();
    expect(Object.keys(sitelist.sites).length).toBeGreaterThan(0);
  });

  it("matches valid site urls", function() {
    expect(sitelist.checkMusicSite("http://" + siteNames[0] + ".com")).toBe(true);
    expect(sitelist.checkMusicSite("http://www." + siteNames[1] + ".fm")).toBe(true);
    expect(sitelist.checkMusicSite("http://" + siteNames[2] + ".someothertld")).toBe(true);
    expect(sitelist.checkMusicSite("http://music." + siteNames[3] + ".com")).toBe(true);
  });

  it("doesn't match invalid site urls", function() {
    // Missing `http://`
    expect(sitelist.checkMusicSite(siteNames[0] + ".com")).toBe(false);
    // Wrong sitename
    expect(sitelist.checkMusicSite("http://" + siteNames[0] + "somenonesense.com")).toBe(false);
    // No TLD
    expect(sitelist.checkMusicSite("http://" + siteNames[0])).toBe(false);
  });

  it("gets site name from valid url", function() {
    expect(sitelist.getSitelistName("http://" + siteNames[0] + ".com")).toBe(siteNames[0]);
    expect(sitelist.getSitelistName("http://" + siteNames[1] + ".com")).toBe(siteNames[1]);
    expect(sitelist.getSitelistName("http://" + siteNames[2] + ".com")).toBe(siteNames[2]);
    expect(sitelist.getSitelistName("http://" + siteNames[3] + ".com")).toBe(siteNames[3]);
  });

  it("gets default controller name from valid url", function() {
    expect(sitelist.getController(siteUrls[0])).toBe(controllerNames[0]);
    expect(sitelist.getController(siteUrls[3])).toBe(controllerNames[3]);
  });

  it("gets custom controller name from valid url", function() {
    expect(sitelist.getController(siteUrls[1])).toBe(controllerNames[1]);
    expect(sitelist.getController(siteUrls[2])).toBe(controllerNames[2]);
  });

  it("matches aliases", function() {
    expect(sitelist.checkMusicSite(aliasUrls[0])).toBe(true);
    expect(sitelist.checkMusicSite(aliasUrls[1])).toBe(true);
    expect(sitelist.checkMusicSite(aliasUrls[2])).toBe(true);
    expect(sitelist.checkMusicSite(aliasUrls[3])).toBe(true);
  });

  it("gets controller name from aliased urls", function() {
    expect(sitelist.getController(aliasUrls[0])).toBe(controllerNames[0]);
    expect(sitelist.getController(aliasUrls[1])).toBe(controllerNames[0]);
    expect(sitelist.getController(aliasUrls[2])).toBe(controllerNames[0]);
    expect(sitelist.getController(aliasUrls[3])).toBe(controllerNames[1]);
  });

  it("doesn't get wrong controller from alias", function() {
    expect(sitelist.getController(aliasUrls[0])).not.toBe(controllerNames[1]);
  });

  it("doesn't match blacklisted domains", function() {
    expect(sitelist.checkMusicSite(blacklistUrls[0])).toBe(false);
    expect(sitelist.checkMusicSite(blacklistUrls[1])).toBe(false);
    expect(sitelist.checkMusicSite(blacklistUrls[2])).toBe(false);
  });

  it("gets all enabled sites", function() {
    expect(sitelist.getEnabled().length).toBe(siteNames.length);
  });

  it("gets music tabs from chrome tabs", function(done) {
    sitelist.getMusicTabs().then(function(musicTabs) {
      expect(musicTabs.length).toBe(tabs.length);
      done();
    });
  });

  it("gets active music tabs when all are active", function(done) {
    sitelist.getActiveMusicTabs().then(function(musicTabs) {
      expect(musicTabs.length).toBe(tabs.length);
      done();
    });
  });

  it("disables a tab", function() {
    expect(sitelist.checkTabEnabled(tabs[0].id)).toBe(true);
    sitelist.markTabEnabledState(tabs[0].id, false);
    expect(sitelist.checkTabEnabled(tabs[0].id)).toBe(false);
  });
})
