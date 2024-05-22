let cheerio = require('cheerio');
let request = require('request');
let qs = require('querystring');

let proxify = (data,jar) => {
    return new Promise((res,rej)=>{
        request({
            url: 'https:/\/www.4everproxy.com/query',
            method: 'POST',
            followAllRedirects: true,
            headers: {
                'cookie': jar,
    	            'content-type': 'application/x-www-form-urlencoded',
    	        },
            body: qs.stringify(data)
        },(e,r,b)=>(!e && r.statusCode == 200) ? res(b) : rej(e))
    })
}

let getConfig = () => {
    return new Promise(async(res,rej)=>{
        let data = await new Promise((Res,Rej)=>{
            request({
                url: 'https:/\/www.4everproxy.com/',
                method: 'GET'
            },(e,r,b)=>(!e && r.statusCode == 200) ? Res({cookie: r.headers['set-cookie'][0].split(';')[0], body: b}) : Rej(e))
        }).catch(e=>{
            throw new Error(`Error while making the request!\n\n${String(e)}`);
        })
        let $ = cheerio.load(data.body)
        let serverList = [],ipLocList = []
        $('select[id=server_name] optgroup option').each((i,e)=>{
            let obj = {};
            obj.location = $(e).text();
            obj.server_name = $(e).attr('value');
            serverList.push(obj)
        })
        $('select[name=selip] option').each((i,e)=>{
            let obj = {};
            obj.ip = $(e).attr('value')
            obj.location = $(e).text()
            ipLocList.push(obj)
        })
        res({
            cookie: data.cookie,
	            proxy_list: {
	   	            servers: serverList,
	   	            ips: ipLocList
	            }
        })
    })
}

let getObjectByLocation = (el,array) => {
  return array.find(obj => obj.location.toLowerCase().includes(el.toLowerCase()));
}


let searchSong = async(q) => {
//THIS FUNC. IS FOR GETTING THE COOKIES AND AVAILABLE SERVERS & IP'S TO BE USED ON REQ.
let {proxy_list,cookie} = await getConfig()
//THIS IS THE DATA THAT WE'RE GOING TO POST
let formData = {
    u: `https:/\/search.azlyrics.com/suggest.php?q=${q}`, //YOUR URL YOU WANT TO PROXIFIED
    u_default: 'https:/\/www.google.com/', //IF "u" params. IS NOT FILLED IT WILL USE THIS AS YOUR URL (NOT REALLY IMPORTANT)
    customip: '', //IF YOU HAVE OWN IP
    server_name: getObjectByLocation('newyork',proxy_list.servers).server_name, //GET THIS VALUE ON "getConfig()" servers[. . .array]
    selip: getObjectByLocation('newyork',proxy_list.ips).ip, //GET THIS VALUE ON "getConfig()" ips[. . .array]
    allowCookies: 'on' //THERE ARE MORE OTHER OPTIONAL OPTIONS BUT I CHOOSE TO EXCLUDE THEM ON REQ.
}

//THE RESULT OF THIS FUNC. IS THE UNBLOCKED CONTENT
let data = await proxify(formData,cookie)
return JSON.parse(data)
}

let getLyrics = async(url) => {
let {proxy_list,cookie} = await getConfig()
let formData = {
    u: url, //YOUR URL YOU WANT TO PROXIFIED
    u_default: 'https:/\/www.google.com/', //IF "u" params. IS NOT FILLED IT WILL USE THIS AS YOUR URL (NOT REALLY IMPORTANT)
    customip: '', //IF YOU HAVE OWN IP
    server_name: getObjectByLocation('newyork',proxy_list.servers).server_name, //GET THIS VALUE ON "getConfig()" servers[. . .array]
    selip: getObjectByLocation('newyork',proxy_list.ips).ip, //GET THIS VALUE ON "getConfig()" ips[. . .array]
    allowCookies: 'on' //THERE ARE MORE OTHER OPTIONAL OPTIONS BUT I CHOOSE TO EXCLUDE THEM ON REQ.
}
let html = await proxify(formData,cookie)
let $ = cheerio.load(html)
let title = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().text()
let lyrics = $('div[class="col-xs-12 col-lg-8 text-center"] div[class=ringtone]').next().next().next().next().text()+'}'
let types = lyrics.match(/\[(.*?):\]/g)
if (types == null) return {title: title, lyricsList: lyrics.trim()};
let translation = types.join().replace(/[\[\]:]/g,'').split(',')
lyrics = lyrics.trimStart().trim().replace(/\[(.*?):\]/g,`}{`).substr(1).match(/{(.*?)}/g).map(e=>e.replace(/[{}]/g,'').trim().trimStart().replace(/  /g,'\n\n'))
lyrics = types.map((e,i)=>{
    return {[`${translation[i]}`]: `${e}\n\n${lyrics[i]}`}
})
return { title: title, lyricsList: lyrics }
}

module.exports = {
    getLyrics,
    searchSong
}
