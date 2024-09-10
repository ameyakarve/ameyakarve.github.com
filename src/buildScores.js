const fdrData = require('./fdrDataModule');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

console.log(fdrData);

let names = fdrData.map(d => {
    return {
        shortName: d['GW/Team'],
        fullName: d['Fullname']
    };
});

const modelCoeff = {
    'LEI':  [ 0.00323536 , 0.07673347],
    'ARS':   [ 0.09892528 ,-0.08527686],
    'BOU':   [ 0.09524827 , 0.03313174],
    'BHA':   [ 0.01932818 , 0.079629  ],
    'EVE':   [ 0.03981877 , 0.03512704],
    'SOU':   [-0.07810612 , 0.06346211],
    'NEW':   [ 0.06942482 , 0.00621383],
    'BRE':   [ 0.02258154 , 0.0549944 ],
    'CHE':   [ 0.11735395 ,-0.01472452],
    'MUN':   [-0.03933321 , 0.11714428],
    'NFO':   [ 0.06940073 ,-0.03249056],
    'FUL':   [ 0.00746323 , 0.01919139],
    'LIV':   [ 0.07304702 ,-0.05577057],
    'WOL':   [-0.043662   , 0.07681533],
    'TOT':   [ 0.03813187 , 0.05277905],
    'MCI':   [-0.00951389 ,-0.06014205],
    'AVL':   [ 0.00476875 , 0.13228408],
    'WHU':   [-0.02316707 , 0.0978537 ],
    'CRY':   [ 0.09452654 , 0.05997745],
    'IPS':   [ 0.09954841 , 0.00208814]
};

async function downloadAndSaveData() {
    const tmpDir = path.join(process.cwd(), 'tmp');

    // 1. Create or clear tmp folder
    try {
        await fs.mkdir(tmpDir, { recursive: true });
        const files = await fs.readdir(tmpDir);
        for (const file of files) {
            await fs.unlink(path.join(tmpDir, file));
        }
    } catch (err) {
        console.error('Error creating or clearing tmp folder:', err);
        return;
    }

    // 2. Download and save data for each name
    for (const name of names) {
        try {
            console.log(name);
            const response = await axios.get(`http://api.clubelo.com/${encodeURIComponent(name.fullName)}`);
            const filePath = path.join(tmpDir, `${name.shortName}.csv`);
            await fs.writeFile(filePath, response.data);
            console.log(`Downloaded and saved data for ${name.fullName}`);
        } catch (err) {
            console.error(`Error downloading data for ${name.fullName}:`, err.message);
        }
    }

    // 3. Read and print the last row of each CSV file
    let eloMap = {};
    for (const name of names) {
        const filePath = path.join(tmpDir, `${name.shortName}.csv`);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const rows = fileContent.trim().split('\n');
        const lastRow = rows[rows.length - 1];
        let elo = lastRow.split(',')[4];
        eloMap[name.shortName] = parseFloat(elo);
        console.log(`${name.shortName}: ${lastRow.split(',')[4]}`);
    }
    let fdrMap = {};
    
    for (const name of names) {
        fdrMap[name.shortName] = fdrData.filter(d => d['GW/Team'] === name.shortName).flatMap(d => {
            return Array.from(Array(38).keys()).map(t => d[`${t + 1}`]).map(u => {
                let splits = u.split(' ');
                let opponent = splits[0];
                let home = '(H)' === splits[1];
                let eloDiff = eloMap[name.shortName] - eloMap[opponent];
                let pWin = 1.0 / (Math.pow(10.0, (-eloDiff/400.0)) + 1.0);
                let pLoss = 1.0 / (Math.pow(10.0, (+eloDiff/400.0)) + 1.0);
                let modelAdjustment = (modelCoeff[name.shortName][home?0:1] + modelCoeff[opponent][home?1:0]);
                let adjustedP = ((pWin / (pWin + pLoss)) + modelAdjustment) / (1 + 2 * modelAdjustment);
                return {opponent: opponent, home: home, fdr: adjustedP};
            });
        });
    }
    // Write fdrMap into a JS module
     // Write fdrMap into a new JS module
     const fdrMapContent = `const fdrMap = ${JSON.stringify(fdrMap, null, 2)};\n\nmodule.exports = { fdrMap };`;
    
     
    await fs.writeFile('./src/generatedFdrMap.js', fdrMapContent);
    console.log('Successfully wrote fdrMap to generatedFdrMap.js');
}

downloadAndSaveData();