import { scraperHelpers as h} from './scraperHelpers/scraperHelpers.js'


async function test(){ 

    let url = 'https://www.mondou.com'
    await h.scraper.init(url)
    await h.scraper.get(url)
}

test()