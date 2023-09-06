import * as fs from 'fs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

const url = 'https://memegen-link-examples-upleveled.netlify.app/';
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

const response = await axios.get(
  'https://memegen-link-examples-upleveled.netlify.app/',
);
const html = response.data;
console.log(html);
