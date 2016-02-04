var Sitelist = require("../code/js/modules/Sitelist.js"),
    SiteData = require("./helpers/site_data.js"),
    _ = require("lodash");

chrome.storage.sync = require("./helpers/chrome_storage_area.js");

var sitelist, siteNames, controllerNames, siteUrls,
    aliasUrls, blacklistUrls, tabs, mockedSites;

siteNames = SiteData.siteNames;
controllerNames = SiteData.controllerNames;
siteUrls = SiteData.siteUrls;
aliasUrls = SiteData.aliasUrls;
blacklistUrls = SiteData.blacklistUrls;
mockedSites = SiteData.mockedSites;

describe("sitelist", function() {
  beforeAll(function() {
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

    chrome.storage.sync.clear();

    sitelist = new Sitelist(mockedSites);
    sitelist.loadSettings();
  });

  afterAll(function() {
    chrome.storage.sync.clear();
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
    // Sitename in querystring
    // TODO: fix this
    // expect(sitelist.checkMusicSite("https://www.someothersite.com/index?site=www." + siteNames[0] + ".com")).toBe(false);
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
      expect(musicTabs.enabled.length).toBe(tabs.length);
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
    sitelist.setSiteState(siteNames[0], { enabled: false }).then(function() {
      expect(sitelist.getEnabled().length).toBe(siteNames.length - 1);
      expect(sitelist.checkEnabled(siteUrls[0])).toBe(false);

      sitelist.getMusicTabs().then(function(musicTabs) {
        expect(musicTabs.enabled.length).toBe(tabs.length - 1);
        expect(musicTabs.disabled.length).toBe(1);

        sitelist.setSiteState(siteNames[0], { enabled: true }).then(function() {
          expect(sitelist.getEnabled().length).toBe(siteNames.length);
          expect(sitelist.checkEnabled(siteUrls[0])).toBe(true);
          done();
        });
      });
    });
  });
});

describe("loading settings from chrome.storage.sync", function() {
  var storageSitelist;

  describe("loading v0 settings", function() {
    beforeAll(function() {
      var oldSettingObj = {};
      oldSettingObj[siteNames[0]] = false;
      oldSettingObj[siteNames[1]] = true;
      oldSettingObj[siteNames[2]] = false;
      oldSettingObj[siteNames[3]] = true;

      chrome.storage.sync.clear();

      chrome.storage.sync.set({
        "hotkey-sites": oldSettingObj
      });

      storageSitelist = new Sitelist(mockedSites);
      storageSitelist.loadSettings();
    });

    it("creates properly structured storage object", function(done) {
      chrome.storage.sync.get(
        function(storageObject) {
          expect(storageObject["hotkey-sites"]).toBeDefined();
          expect(storageObject["hotkey-storage-version"]).toBe(1);

          var sites = storageObject["hotkey-sites"];
          expect(sites[siteNames[0]].enabled).toBe(false);
          expect(sites[siteNames[0]].priority).toEqual(1);
          expect(sites[siteNames[1]].enabled).toBe(true);
          expect(sites[siteNames[1]].priority).toEqual(1);
          expect(sites[siteNames[2]].enabled).toBe(false);
          expect(sites[siteNames[2]].priority).toEqual(1);
          expect(sites[siteNames[3]].enabled).toBe(true);
          expect(sites[siteNames[3]].priority).toEqual(1);

          done();
        }
      );
    });

    it("marks enabled states on sitelsit", function() {
      expect(storageSitelist.checkEnabled(siteUrls[0])).toBe(false);
      expect(storageSitelist.checkEnabled(siteUrls[1])).toBe(true);
      expect(storageSitelist.checkEnabled(siteUrls[2])).toBe(false);
      expect(storageSitelist.checkEnabled(siteUrls[3])).toBe(true);
      expect(storageSitelist.getEnabled()).toContain(siteNames[1]);
      expect(storageSitelist.getEnabled()).toContain(siteNames[3]);
    });
  });

  describe("loading v1 settings with missing and undefined sites", function() {
    var storageSitelist;

    beforeAll(function() {
      var settingObj = {};
      settingObj[siteNames[0]] = { enabled: false, priority: null };
      settingObj[siteNames[1]] = { enabled: undefined, priority: 2 };
      settingObj[siteNames[2]] = { enabled: true, priority: 3 };

      chrome.storage.sync.clear();

      chrome.storage.sync.set({
        "hotkey-sites": settingObj,
        "hotkey-storage-version": 1
      });

      storageSitelist = new Sitelist(mockedSites);
      storageSitelist.loadSettings();
    });


    it("creates properly structured storage object", function(done) {
      chrome.storage.sync.get(
        function(storageObject) {
          expect(storageObject["hotkey-sites"]).toBeDefined();
          expect(storageObject["hotkey-storage-version"]).toBe(1);

          var sites = storageObject["hotkey-sites"];
          expect(sites[siteNames[0]].enabled).toBe(false);
          expect(sites[siteNames[0]].priority).toEqual(1);
          expect(sites[siteNames[1]].enabled).toBe(true);
          expect(sites[siteNames[1]].priority).toEqual(2);
          expect(sites[siteNames[2]].enabled).toBe(true);
          expect(sites[siteNames[2]].priority).toEqual(3);

          done();
        }
      );
    });

    it("marks enabled states on sitelsit", function() {
      expect(storageSitelist.checkEnabled(siteUrls[0])).toBe(false);
      expect(storageSitelist.checkEnabled(siteUrls[1])).toBe(true);
      expect(storageSitelist.checkEnabled(siteUrls[2])).toBe(true);
      expect(storageSitelist.getEnabled()).toContain(siteNames[1]);
      expect(storageSitelist.getEnabled()).toContain(siteNames[2]);
    });
  });
});

describe("site priority", function() {
  var prioritySitelist;

  beforeAll(function() {
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
        title: siteNames[2],
        url: siteUrls[2]
      },
      {
        id: 4,
        title: siteNames[3],
        url: siteUrls[3]
      }
    ];

    chrome.tabs.query.yields(tabs);

    chrome.storage.sync.clear();

    prioritySitelist = new Sitelist(mockedSites);
    prioritySitelist.loadSettings();
  });

  it("sets priority", function(done) {
    prioritySitelist.setSiteState(siteNames[1], { priority: 3 }).then(function() {
      expect(prioritySitelist.getPriority(siteNames[1])).toEqual(3);
      prioritySitelist.setSiteState(siteNames[2], { priority: 3 }).then(function() {
        expect(prioritySitelist.getPriority(siteNames[2])).toEqual(3);
        done();
      });
    });
  });

  it("only returns tabs with highest priority", function(done) {
    prioritySitelist.getActiveMusicTabs().then(function(tabs) {
      var activeUrls = tabs.map(function(tab) { return tab.url; });

      expect(activeUrls).toContain(siteUrls[1]);
      expect(activeUrls).toContain(siteUrls[2]);
      expect(activeUrls).not.toContain(siteUrls[0]);
      done();
    });
  });

  it("doesn't affect site enabled state", function() {
    expect(prioritySitelist.checkEnabled(siteUrls[0])).toBe(true);
    expect(prioritySitelist.checkEnabled(siteUrls[1])).toBe(true);
    expect(prioritySitelist.checkEnabled(siteUrls[2])).toBe(true);
    expect(prioritySitelist.checkEnabled(siteUrls[3])).toBe(true);
  });

  it("doesn't affect tab enabled state", function() {
    expect(prioritySitelist.checkTabEnabled(tabs[0].id)).toBe(true);
    expect(prioritySitelist.checkTabEnabled(tabs[1].id)).toBe(true);
    expect(prioritySitelist.checkTabEnabled(tabs[2].id)).toBe(true);
    expect(prioritySitelist.checkTabEnabled(tabs[3].id)).toBe(true);
  });
});
