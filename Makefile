build: 
docker build -t puppeteer-chrome-linux .

run: 
docker run -i --init --rm -p 3000:3000 --cap-add=SYS_ADMIN \
   --name puppeteer-chrome puppeteer-chrome-linux \
      npm run prod-run