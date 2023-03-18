const scrapingbee = require('scrapingbee');
const request = require('request-promise');
const axios = require("axios");

module.exports.scrapingbee = async (obj)=>{
	let client = new scrapingbee.ScrapingBeeClient(obj.apikey);
    let {data} = await client.get({
        url: obj.url,
        params: {  
            'block_ads': 'False',
            'render_js': 'False',
            'country_code': 'us',
            'premium_proxy': 'True',
        },
    })
    let decoder = new TextDecoder();
    let res = decoder.decode(data);
    try{
        JSON.parse(res)
        return JSON.parse(res);
    }catch(e){
        return res;
    }
}

module.exports.scrapeops = async (obj)=>{
    let url = `https://proxy.scrapeops.io/v1/?api_key=${obj.apikey}&url=${obj.url}&residential=true`
    let data = await request(url).then(data =>{
        return data
    }).catch(({response}) => {
        return response.data
    })
    try{
        JSON.parse(data)
        return JSON.parse(data);
    }catch(e){
        return data;
    }
}

module.exports.zenrows = async (obj)=>{
    let url = encodeURIComponent(obj.url)
    let data = await axios.get(`https://api.zenrows.com/v1/?apikey=${obj.apikey}&url=${url}&premium_proxy=true`).then(({data}) =>{
        return data
    }).catch(({response}) => {
        return response.data
    });
    return data
}