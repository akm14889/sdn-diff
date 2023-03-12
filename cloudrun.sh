git clone https://github.com/akm14889/sdn-diff.git
nvm install v16.19.1
cd sdn-diff/backend/
npm install


# upload pelican list.csv to data/currentPelicanList directory once upload is done, copy and run below commands.
node index.js
dl ./data/output/SDN_DIFF.csv
cd ~
sleep 1m
rm -rf sdn-diff
