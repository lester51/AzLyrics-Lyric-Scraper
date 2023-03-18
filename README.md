# AZLYRICS LYRIC SCRAPER

![AzLyrics](https://www.azlyrics.com/az_logo_tr.png)

AzLyrics webscraper that returns a promise in JSON format. Another feature of this scraper is that it prevents the anti-bot detection so we can avoid human verifications such as captchas.

# HOW TO GET API KEYS?
### Simply click one of the links below, create a new account and get your api key.
[ScrapingBee](https://www.scrapingbee.com)
[ZenRows](https://www.zenrows.com)
[ScrapeOps](https://scrapeops.io)

# HOW TO INSTALL?
```
npm i azlyrics-lyric-scraper
```

# Require to export function
```js
//CommonJS
const client = require("azlyrics-lyric-scraper");
```

## SIMPLE USAGE
### usage of `searchSong()` and `getLyrics()`
```js
const client = require("azlyrics-lyric-scraper");
let azlyrics = new client("YOUR-API-KEY-HERE")

let data = await azlyrics.searchSong("yoru ni kakeru")
console.log(data)

let data2 = await azlyrics.getLyrics(data.songs[0].url)
console.log(data2)
```