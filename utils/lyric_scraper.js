const cheerio = require("cheerio");

module.exports = (result)=>{
    let html = result.replace('<!-- Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that. -->','</div><div class="LyricsLester"><div class="lyricsLester">').replace("<!-- MxM banner -->","</div>").replace(/<i>/g,"</p><p><i>").replace("</p>","").replace(/<\/i>/g,"</i><span>").replace(/<\/p>/g,"</span></p>")
    let $ = cheerio.load(html)
    let LyricsClass = $("div[class='col-xs-12 col-lg-8 text-center'] div[class='LyricsLester'] div[class='lyricsLester'] p");
    let TitleClass = $("div[class='col-xs-12 col-lg-8 text-center']").children("b").text();
    let azlyrics = [];
    LyricsClass.each((idx, el) => {
        let az = {};
        az.translation = $(el).children("i").text();
        az.lyrics = $(el).children("span").text().trim();
        azlyrics.push(az);
    });
    if (azlyrics.length != 0) return azlyrics;
    else{
  	    let html = result.replace("<!-- Usage","<div><!-- Usage").replace("<!-- MxM banner -->","</div>")
  	    let $ = cheerio.load(html)
  	    let lyrics = $("div[class='col-xs-12 col-lg-8 text-center']").children("div").children("div").text().trim().split("\n      \n")[0]
  	    azlyrics.push({lyrics:lyrics});
        return azlyrics
    }
}