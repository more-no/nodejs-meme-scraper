import * as fs from 'node:fs';
import got from 'got';
import * as cheerio from 'cheerio';

const folderPath = './memes';
const URL = 'https://memegen-link-examples-upleveled.netlify.app/';

fs.access(folderPath, (error) => {
  // To check if the given directory already exists or not
  if (error) {
    // If current directory does not exist then create it
    fs.mkdir(folderPath, (error1) => {
      if (error1) {
        console.log(error1);
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

    // Using cheerio to extract <img> tags
    const $ = cheerio.load(html);
    const imageElements = $('img');

    for (let i = 0; i < 10 && i < imageElements.length; i++) {
      const imageUrl = $(imageElements[i]).attr('src');
      const res = await fetch(imageUrl);

      // create file with correct name
      if (res.ok) {
        if (i < 9) {
          const fileName = `0${i + 1}.jpg`;
          const filePath = `${folderPath}/${fileName}`;

          const fileStream = fs.createWriteStream(filePath);
          res.body.pipe(fileStream);
        } else {
          const fileName = `${i + 1}.jpg`;
          const filePath = `${folderPath}/${fileName}`;

          const fileStream = fs.createWriteStream(filePath);
          res.body.pipe(fileStream);
        }

        console.log(`Image ${i + 1} downloaded successfully.`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

await extractLinks(URL);
