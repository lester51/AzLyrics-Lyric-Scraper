const { scrapingbee, scrapeops, zenrows } = require('./utils/search_scraper.js');
const lyricScraper = require('./utils/lyric_scraper.js');

module.exports = class client {
    constructor(apikey){
        this.apikey = apikey
        this.currentScraper = ""
	}
	async searchSong(q){
	    if (this.apikey.length != 0){
            if (this.apikey===this.apikey.toUpperCase()){
                this.currentScraper = "scrapingbee"
		        let result = await scrapingbee({
	                apikey: this.apikey,
	                url: `https://search.azlyrics.com/suggest.php?q=${q}`
	            })
	            return result
		    }
		    else if (this.apikey.includes("-")&&this.apikey===this.apikey.toLowerCase()){
		        this.currentScraper = "scrapeops"
		        let result = await scrapeops({
	                apikey: this.apikey,
	                url: `https://search.azlyrics.com/suggest.php?q=${q}`
	            })
	            return result
		    }
		    else if (!(this.apikey.includes("-"))&&this.apikey === this.apikey.toLowerCase()){
		        this.currentScraper = "zenrows"
		        let result = await zenrows({
	                apikey: this.apikey,
	                url: `https://search.azlyrics.com/suggest.php?q=${q}`
	            })
	            return result
		    }
		}else{
		    return {
		        errorMsg: "No API key provided!",
		        tip: "To get an API key just visit one of these following links, create a free/paid account and get your own API key.\n\nLinks: www.scrapingbee.com, www.zenrows.com & scrapeops.io"
		    };
		}
    }
	async getLyrics(link){
	    if (this.currentScraper === "scrapingbee"){
		    let result = await scrapingbee({
	            apikey: this.apikey,
	            url: link
	        })
	        return lyricScraper(result)
	    }
	    else if (this.currentScraper === "scrapeops"){
	        let result = await scrapeops({
	            apikey: this.apikey,
	            url: link
	        })
            return lyricScraper(result)
        }
        else if (this.currentScraper === "zenrows"){
            let result = await zenrows({
	            apikey: this.apikey,
	            url: link
	        })
            return lyricScraper(result)
       }
	}
}
