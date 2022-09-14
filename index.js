// Importing axios from axios module and parse function from node-html-parser
var axios = require("axios");
var { parse } = require("node-html-parser");
var { JSDOM } = require('jsdom');

const getUrl = (product_id) => `https://www.amazon.in/gp/product/ajax/ref=dp_aod_NEW_mbc?asin=${product_id}&m=&qid=&smid=&sourcecustomerorglistid=&sourcecustomerorglistitemid=&sr=&pc=dp&experienceId=aodAjaxMain`

// Scrape function to fetch the data from a webpage and show it's HTML Elements in the parsed data
let scrape = async (product_id) => {
  let data = await axios.get(getUrl(product_id), {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36"
    }
  });
  // console.log(data.data) // the actual data scraped from webpage

  let res = parse(data.data)
  // // console.log(res) // HTML Element from the parsed data   
  const dom = new JSDOM(data.data);

  const $ = (selector) => dom.window.document.querySelector(selector);

  const title = $('#aod-asin-title-text').textContent.trim();

  const getOffer = (element) => {
    const price = element.querySelector('.a-offscreen').textContent;
    const ships_from = element.querySelector('#aod-offer-shipsFrom .a-col-right .a-size-small').textContent.trim();
    const sold_by = element.querySelector('#aod-offer-soldBy .a-col-right .a-size-small').textContent.trim();
    const delivery_message = element.querySelector('.aod-unified-delivery').textContent.trim();
    return {
      price,
      ships_from,
      sold_by,
      delivery_message: delivery_message.replace("Details", " ").trim()
    };
  }

  const pinnedElement = $('#pinned-de-id');

  const offers = [];
  const offerListElement = $("#aod-offer-list");

  const offerElements = offerListElement.querySelectorAll('.aod-information-block');

  offerElements.forEach((offerElement) => {
    offers.push(getOffer(offerElement));
  });

  const result = {
    product_id,
    title,
    pinned: getOffer(pinnedElement),
    offers,
  }
  console.log(result);

};

scrape(
  // 'B0B1XCZPGQ'
  'B0002E4Z8M'
  // 'B07L3ZCJ53'
  // 'B08CSHBPD5'
);

