import * as fs from 'node:fs';
import axios from 'axios';
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
    const response = await axios.get(url);
    const html = response.data;

    // Using cheerio to extract <img> tags
    const $ = cheerio.load(html);
    const imageElements = $('img');

    for (let i = 0; i < 10 && i < imageElements.length; i++) {
      const imageUrl = $(imageElements[i]).attr('src');
      const res = await axios.get(imageUrl, { responseType: 'stream' });
      // const res = await fetch(imageUrl);

      // create file with correct name
      if (res.status === 200) {
        const fileName = i < 9 ? `0${i + 1}.jpg` : `${i + 1}.jpg`;
        const filePath = `${folderPath}/${fileName}`;

        const fileStream = fs.createWriteStream(filePath);
        res.data.pipe(fileStream);

        console.log(`Image ${i + 1} downloaded successfully.`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

await extractLinks(URL);
