const express = require('express');
const az = require('azlyrics-scrape-api');
const port = 3000;
const app = express();

app.get('/', (req, res) => {
    res.sendFile('/index.html',{root: __dirname})
})

app.get('/lyrics', async function(req, res) {
    let title = req.query.title;
	try {
	    if (!title) throw new Error('title parameter is empty!');
	    let res1 = await az.searchSong(title)
	    let res2 = await az.getLyrics(res1.songs[0].url)
	    res.send(`<body>${res2}</body><script>
        !function() {
            function detect(allow) {
                if(isNaN(+allow)) allow = 100;
                var start = +new Date();
                debugger;
                var end = +new Date();
                if(isNaN(start) || isNaN(end) || end - start > allow) {
                    window.location.replace("https://2facethreads.com/cdn/shop/files/Un>
                }
            }
            if(window.attachEvent) {
                if (document.readyState === "complete" || document.readyState === "inte>
                    detectDevTool();
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
    </script>`)
	}
	catch (e) {
		if (!e.response) {
			res.json({
				error: e.message
			});
		} else {
			res.json({
				error: `${e.response.status} ${e.response.statusText}`,
				data: e.response.data.message
			});
		}
	}
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});

module.exports = app;
