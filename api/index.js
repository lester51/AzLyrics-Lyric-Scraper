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
	    res.json(res2)
	}
	catch (e) {
		if (!e.response) {
			res.json({error: e.message})
		} else {
			res.json({error: e.response.status+' '+ e.response.statusText,data: e.response.data.message})
		}
	}
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
});

module.exports = app;
