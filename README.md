# AZLYRICS LYRIC SCRAPER

![AzLyrics](https://www.azlyrics.com/az_logo_tr.png)

AzLyrics webscraper that returns a promise in JSON format. Another feature of this scraper is that it prevents the anti-bot detection so we can avoid human verifications such as captchas.

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
(async()=>
const azlyrics = require("azlyrics-lyric-scraper");

let res1 = await azlyrics.searchSong('Mou Sukoshi Dake Yoasobi')
console.log(res1)
let res2 = await azlyrics.getLyrics(res1.songs[0].url)
console.log(res2)
})()
```