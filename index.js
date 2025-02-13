const miniget = require('miniget');
const cheerio = require('cheerio');

let searchSong = async(title) => {
    try {
        if (!title) throw new Error('Title parameter is missing.');
        let res = JSON.parse(await miniget('https:/\/search.azlyrics.com/suggest.php?q='+title).text());
        if (!res.songs.length) throw new Error('No lyrics for this song yet on our page.');
        return res;
    } catch (e) {
        return e.toString();
    }
}

let getLyrics = async(url) => {
    try {
        let res = await miniget(url).text();
        $ = cheerio.load(res);
        title = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().text();
        lyrics = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().next().next().next().text();
        types = lyrics.match(/\[(.*?):\]/g);
        if (types == null) return [{ title: title, lyrics: lyrics.trim()}];
        translation = types.join().replace(/[\[\]:]/g, '').split(',');
        lyrics = lyrics + '}';
        lyrics = lyrics.trimStart().trim().replace(/\[(.*?):\]/g, "}{").substr(1).match(/\{[^]*?\}/g).map(function (e) { return e.replace(/[{}]/g, '').trim().trimStart().replace(/  /g, '\n\n'); });
        lyrics = types.map((e,i)=>{
            return {[`${translation[i]}`]: `${e}\n\n${lyrics[i]}`}
        })
        return [{ title: title, lyricsList: lyrics }];
    } catch (e) {
        return e.toString();
    }
}

module.exports = {
    getLyrics,
    searchSong
}
