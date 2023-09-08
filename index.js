import * as fs from 'fs';
import https from 'https';
import fetch from 'node-fetch';
import got from 'got';
import * as cheerio from 'cheerio';
import axios from 'axios';

const folderPath = './memes';

fs.access(folderPath, (error) => {
  // To check if the given directory already exists or not
  if (error) {
    // If current directory does not exist then create it
    fs.mkdir(folderPath, (error) => {
      if (error) {
        console.log(error);
      } else {
        console.log('New Directory created.');
      }
    });
  } else {
    console.log('Given Directory already exists.');
  }
});

const extractLinks = async (url) => {
  try {
    // Fetching HTML
    const response = await got(url);
    const html = response.body;

    // Using cheerio to extract <a> tags
    const $ = cheerio.load(html);
    const linkObjects = $('a'); // this is a mass object, not an array

    // Collect the "href" of each link and add them to an array
    const links = [];
    linkObjects.each((index, element) => {
      links.push({
        href: $(element).attr('href'), // get the href attribute
      });
    });

    for (let i = 6; i < 16; i++) {
      let tempUrl = links[i].href;
      let imageUrl = tempUrl.slice(30);
      console.log(imageUrl);
      const localPath = './memes';

      fetch(imageUrl).then((res) =>
        res.body.pipe(fs.createWriteStream(`./memes/image${i - 5}.jpg`)),
      );
    }
  } catch (error) {
    console.log(error.response.body);
  }
};

const URL = 'https://memegen-link-examples-upleveled.netlify.app/';
extractLinks(URL);
