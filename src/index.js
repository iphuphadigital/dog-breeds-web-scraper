const puppeteer = require('puppeteer');
const fs = require('fs');


const takeScreenShot = async () => {
  // Initiate the browser
  const browser = await puppeteer.launch();
  // Open a new blank page
  const page = await browser.newPage();
  // Navigate to url and wait until the page has completely loaded
  await page.goto(`https://en.wikipedia.org/wiki/List_of_dog_breeds`, { waitUntil: 'networkidle0' });
  // Selected table by aria-label instead of div id
  const breedsList = await page.$$eval('div.div-col ul li > a', (elements) => {
    let breedsList = []
    elements.forEach(element => {
      const record = { 'name': '', 'url': '' }
      record.name = element.innerText; // anchor tag contains the breed's name
      record.url = `https://en.wikipedia.org` + element.getAttribute('href')
      if (record.name && record.url) breedsList.push(record)
    });
    return breedsList;
  });

  await browser.close();

  // Store output
  fs.writeFile('output/all-dog-breeds.json', JSON.stringify(breedsList, null, 2), (err) => {
    if (err) { console.log(err) }
    else { console.log(`Saved ${breedsList.length} Successfully!`) }
  })
};

takeScreenShot();