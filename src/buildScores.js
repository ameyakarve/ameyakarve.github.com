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
    'LEI': [ 0.0661328,-0.01504796],
    'ARS': [ 0.01706234,0.04745001],
    'BOU': [ 0.07528398,0.00338777],
    'BHA': [ 0.02471483,0.03082288],
    'EVE': [ 0.02593292,0.00371114],
    'SOU': [ 0.05586749, -0.05084018],
    'NEW': [ 0.01278976,0.04081815],
    'BRE': [ 0.02069933,0.01102145],
    'CHE': [ 0.0288258, 0.01616876],
    'MUN': [-0.02853797,0.07633645],
    'NFO': [ 0.10068624, -0.06897336],
    'FUL': [ 0.01506008, -0.00571605],
    'LIV': [-0.01606548,0.07660902],
    'WOL': [-0.01358386,0.05602879],
    'TOT': [ 0.02662614,0.041118,],
    'MCI': [-0.06652872,0.07254916],
    'AVL': [-0.03701366,0.09071942],
    'WHU': [-0.04478508,0.06398836],
    'CRY': [ 0.06293597,0.04755243],
    'IPS': [ 0.15590807, -0.05569325]
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
        fdrMap[name.shortName] = fdrData.filter(d => d['GW/Team'] === name.shortName).map(d => {
            return Array.from(Array(38).keys()).map(t => d[`${t + 1}`]).map(u => {
                let splits = u.split(' ');
                let opponent = splits[0];
                let eloDiff = eloMap[name.shortName] - eloMap[opponent];
                let pWin = 1.0 / (Math.pow(10.0, (-eloDiff/400.0)) + 1.0);
                let adjustedP = pWin + modelCoeff[name.shortName][0] + modelCoeff[opponent][1];
                return {opponent: opponent, home: '(H)' === splits[1], fdr: 2 * adjustedP - 1.0};
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