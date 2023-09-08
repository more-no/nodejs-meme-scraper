import * as fs from 'node:fs';
import fetch from 'node-fetch';
import got from 'got';
import * as cheerio from 'cheerio';

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
      const tempUrl = links[i].href;
      const imageUrl = tempUrl.slice(30);
      console.log(imageUrl);

      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      fetch(imageUrl).then((res) =>
        res.body.pipe(fs.createWriteStream(`./memes/image${i - 5}.jpg`)),
      );
    }
  } catch (error) {
    console.log(error.response.body);
  }
};

const URL = 'https://memegen-link-examples-upleveled.netlify.app/';
// eslint-disable-next-line @typescript-eslint/no-floating-promises
extractLinks(URL);
