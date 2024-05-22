var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var cheerio = require('cheerio');
var request = require('request');
var qs = require('querystring');
var proxify = function (data, jar) {
    return new Promise(function (res, rej) {
        request({
            url: 'https:/\/www.4everproxy.com/query',
            method: 'POST',
            followAllRedirects: true,
            headers: {
                'cookie': jar,
                'content-type': 'application/x-www-form-urlencoded',
            },
            body: qs.stringify(data)
        }, function (e, r, b) { return (!e && r.statusCode == 200) ? res(b) : rej(e); });
    });
};
var getConfig = function () {
    return new Promise(function (res, rej) { return __awaiter(_this, void 0, void 0, function () {
        var data, $, serverList, ipLocList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4, new Promise(function (Res, Rej) {
                        request({
                            url: 'https:/\/www.4everproxy.com/',
                            method: 'GET'
                        }, function (e, r, b) { return (!e && r.statusCode == 200) ? Res({ cookie: r.headers['set-cookie'][0].split(';')[0], body: b }) : Rej(e); });
                    }).catch(function (e) {
                        throw new Error("Error while making the request!\n\n".concat(String(e)));
                    })];
                case 1:
                    data = _a.sent();
                    $ = cheerio.load(data.body);
                    serverList = [], ipLocList = [];
                    $('select[id=server_name] optgroup option').each(function (i, e) {
                        var obj = {};
                        obj.location = $(e).text();
                        obj.server_name = $(e).attr('value');
                        serverList.push(obj);
                    });
                    $('select[name=selip] option').each(function (i, e) {
                        var obj = {};
                        obj.ip = $(e).attr('value');
                        obj.location = $(e).text();
                        ipLocList.push(obj);
                    });
                    res({
                        cookie: data.cookie,
                        proxy_list: {
                            servers: serverList,
                            ips: ipLocList
                        }
                    });
                    return [2];
            }
        });
    }); });
};
var getObjectByLocation = function (el, array) {
    return array.find(function (obj) { return obj.location.toLowerCase().includes(el.toLowerCase()); });
};
var searchSong = function (q) { return __awaiter(_this, void 0, void 0, function () {
    var _a, proxy_list, cookie, formData, data;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, getConfig()];
            case 1:
                _a = _b.sent(), proxy_list = _a.proxy_list, cookie = _a.cookie;
                formData = {
                    u: "https://search.azlyrics.com/suggest.php?q=".concat(q),
                    u_default: 'https:/\/www.google.com/',
                    customip: '',
                    server_name: getObjectByLocation('newyork', proxy_list.servers).server_name,
                    selip: getObjectByLocation('newyork', proxy_list.ips).ip,
                    allowCookies: 'on'
                };
                return [4, proxify(formData, cookie)];
            case 2:
                data = _b.sent();
                return [2, JSON.parse(data)];
        }
    });
}); };
var getLyrics = function (url) { return __awaiter(_this, void 0, void 0, function () {
    var _a, proxy_list, cookie, formData, html, $, title, lyrics, types, translation;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4, getConfig()];
            case 1:
                _a = _b.sent(), proxy_list = _a.proxy_list, cookie = _a.cookie;
                formData = {
                    u: url,
                    u_default: 'https:/\/www.google.com/',
                    customip: '',
                    server_name: getObjectByLocation('newyork', proxy_list.servers).server_name,
                    selip: getObjectByLocation('newyork', proxy_list.ips).ip,
                    allowCookies: 'on'
                };
                return [4, proxify(formData, cookie)];
            case 2:
                html = _b.sent();
                $ = cheerio.load(html);
                title = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().text();
                lyrics = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().next().next().next().text() + '}';
                types = lyrics.match(/\[(.*?):\]/g);
                translation = types.join().replace(/[\[\]:]/g, '').split(',');
                lyrics = lyrics.trimStart().trim().replace(/\[(.*?):\]/g, "}{").substr(1).match(/{(.*?)}/g).map(function (e) { return e.replace(/[{}]/g, '').trim().trimStart().replace(/  /g, '\n\n'); });
                lyrics = types.map(function (e, i) {
                    var _a;
                    return _a = {}, _a["".concat(translation[i])] = "".concat(e, "\n\n").concat(lyrics[i]), _a;
                });
                return [2, { title: title, lyricsList: lyrics }];
        }
    });
}); };
module.exports = {
    getLyrics: getLyrics,
    searchSong: searchSong
};
//# sourceMappingURL=index.js.map