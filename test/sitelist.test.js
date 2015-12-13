var Sitelist = require("../code/js/modules/Sitelist.js"),
    SiteData = require("./helpers/site_data.js"),
    _ = require("lodash");

chrome.storage.sync = require("./helpers/chrome_storage_area.js");

describe("sitelist", function() {
  var sitelist, siteNames, controllerNames, siteUrls,
      aliases, aliasUrls, blacklists, blacklistUrls, tabs;

  beforeAll(function() {
    sitelist = SiteData.sitelist;
    siteNames = SiteData.siteNames;
    controllerNames = SiteData.controllerNames;
    siteUrls = SiteData.siteUrls;
    aliases = SiteData.aliases;
    aliasUrls = SiteData.aliasUrls;
    blacklists = SiteData.blacklists;
    blacklistUrls = SiteData.blacklistUrls;

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

  it("toggles enable/disable of a tab", function(done) {
    expect(sitelist.checkTabEnabled(tabs[0].id)).toBe(true);
    sitelist.markTabEnabledState(tabs[0].id, false);
    expect(sitelist.checkTabEnabled(tabs[0].id)).toBe(false);
    sitelist.getActiveMusicTabs().then(function(firstMusicTabs) {
      expect(firstMusicTabs.length).toBe(tabs.length - 1);
      sitelist.markTabEnabledState(tabs[0].id, true);
      expect(sitelist.checkTabEnabled(tabs[0].id)).toBe(true);
      sitelist.getActiveMusicTabs().then(function(secondMusicTabs) {
        expect(secondMusicTabs.length).toBe(tabs.length);
        done();
      });
    });
  });

  it("toggles enable/disable of a site", function(done) {
    expect(sitelist.getEnabled().length).toBe(siteNames.length);
    sitelist.markSiteEnabledState(siteUrls[0], false, function() {
      expect(sitelist.getEnabled().length).toBe(siteNames.length - 1);
      expect(sitelist.checkEnabled(siteUrls[0])).toBe(false);
      sitelist.markSiteEnabledState(siteUrls[0], true, function() {
        expect(sitelist.getEnabled().length).toBe(siteNames.length);
        expect(sitelist.checkEnabled(siteUrls[0])).toBe(true);
        done();
      });
    });
  });
})
