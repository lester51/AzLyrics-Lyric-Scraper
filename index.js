const express = require('express');
const az = require('azlyrics-scrape-api');
const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>AZLyrics Unofficial Documentation</title>
        <meta name="og:description" content="Developed by Lester Navarra">
        <meta name="description" content="Developed by Lester Navarra">
        <style type="text/css">
            *{
                margin: 0;
                padding: 0;
                user-select: none;
                box-sizing: border-box;
                border: 0;
                outline: none;
            }
            body{
                background-color: #eaeaea;
                width: 100%;
                height: 100vh;
            }
            .box{
                margin: .75em;
                background-image: linear-gradient(to top left, #ffffff, 75% #dedede);
                border-radius: 1em;
                padding: .5em;
                box-shadow: 3px 3px 10px #aaaaaa, -10px -10px 10px #ffffff;
            }
            .box:nth-child(even){
                margin: 2em .75em;
            }
            .header{
                display: flex;
                flex-direction: row;
                align-content: center;
                align-items: center;
            }
            .header > .title{
                display: flex;
                flex-direction: column;
                margin: 0 1em;
            }
            .header > img{
                width: 5%;
                margin: 0 1em;
            }
            fieldset > legend {
                margin-left: 2em;
                font-weight: bolder;
                font-variant: small-caps;
            }
            fieldset > blockquote{
                padding-left: 1em;
                margin: 0 1em;
                border-left: 5px #aaaaaa solid;
            }
            fieldset > ul, fieldset > ul > li{
                margin-left: 30px;
                list-style: decimal;
                color: #000000;
                font-weight: bold;
            }
            fieldset > ul > a{
                color: #000000;
                text-decoration: none;
            }
            fieldset > blockquote > span{
                font-weight: bold;
                cursor: pointer;
            }
            fieldset > blockquote > .span{
                display: block;
                padding: .25em .5em;
                width: 100%;
                box-sizing: border-box;
                -webkit-box-sizing: border-box;
                background-color: transparent;
            }
        </style>
    </head>
    <body>
    <div class="header box">
        <img src="https://www.azlyrics.com/az_logo_tr.png" alt="AzLyrics">
        <div class="title">
            <h1 id="azlyrics-lyric-scraper">API DOCUMENTATION</h1>
            <h3>Developed by (HMS)Lester Navarra</h3>
        </div>
    </div>
    <fieldset class="box">
        <legend id="what"><h3>What is AzLyrics API?</h3></legend>
        <blockquote>AzLyrics API that returns a promise in JSON format. Another feature of this API is that it prevents the anti-bot detection so we can avoid human verifications such as captchas.</blockquote>
    </fieldset>
    <fieldset class="box">
        <legend id="based"><h3>API Base URL?</h3></legend>
        <blockquote>Here's the base url of the api <span id="url-click" title="Click to copy">https://azlyrics-lyric-scraper.onrender.com/</span></blockquote>
    </fieldset>
    <fieldset class="box">
        <legend id="routes"><h3>API Routes? [GET]</h3></legend>
        <blockquote>The default or "<mark>/</mark>" will return automatically to this documentation. The table below is the list of the parameters<br><br>The "<mark>/lyrics</mark>" route will fetch the lyrics of the song/music title you provided.</blockquote>
        <table>
            <tr>
                <th>Parameter</th>
                <th>Description</th>
            </tr>
            <tr>
                <td>title</td>
                <td>Song title or music title where can be found in <a href="https://azlyrics.com/">AzLyrics</a></td>
            </tr>
        </table>
    </fieldset>
    <fieldset class="box">
        <legend id="sample"><h3>Example</h3></legend>
        <blockquote>
            <span class="span" id="getLyrics" title="Click to copy">https://azlyrics-lyric-scraper.onrender.com/lyrics?title=Haarper Cinnamon</span>
        </blockquote>
    </fieldset>
    </body>
    <script type="text/javascript">
        document.getElementById("getLyrics").onclick = () => {
            navigator.clipboard.writeText(document.getElementById("getSong").textContent)
        }
    </script>
    <script>
        !function() {
            function detect(allow) {
                if(isNaN(+allow)) allow = 100;
                var start = +new Date();
                debugger;
                var end = +new Date();
                if(isNaN(start) || isNaN(end) || end - start > allow) {
                    window.location.replace("https://2facethreads.com/cdn/shop/files/Untitled-1_3d11b759-0626-439a-a5ce-7c50874180c2.png?v=1687214465&width=600")
                }
            }
            if(window.attachEvent) {
                if (document.readyState === "complete" || document.readyState === "interactive") {
                    detect();
                    window.attachEvent('onresize', detect);
                    window.attachEvent('onmousemove', detect);
                    window.attachEvent('onfocus', detect);
                    window.attachEvent('onblur', detect);
                } else {
                    setTimeout(argument.callee, 0);
                }
            } else {
                window.addEventListener('load', detect);
                window.addEventListener('resize', detect);
                window.addEventListener('mousemove', detect);
                window.addEventListener('focus', detect);
                window.addEventListener('blur', detect);
            }
        }();
    </script>
</html>
    `)
})

app.get('/lyrics', async function(req, res) {
    let title = req.query.title;
	try {
	    if (!title) throw new Error('title parameter is empty!');
	    let res1 = await az.searchSong(title)
	    if (res1.songs.length === 0) throw new Error('There is no lyrics available for this song yet on AzLyrics.com');
	    else {
	        let res2 = await az.getLyrics(res1.songs[0].url)
	        res.status(200).json(res2)
	    }
	}
	catch (e) {
		if (!e.response) {
			res.status(400).json({error: e.message})
		} else {
			res.status(400).json({error: e.response.status+' '+ e.response.statusText,data: e.response.data.message})
		}
	}
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});

module.exports = app;
