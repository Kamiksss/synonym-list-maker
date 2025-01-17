import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { exit, exitCode } from 'process';

const getVocabList = ():string[] => {
    try {
    const vocabfile = fs.readFileSync('./vocab.txt').toString().split("\n");

    return vocabfile;
    }catch{
        console.error("You didn't provide vocab list to search synonyms for. Please edit vocab.txt");
        fs.writeFileSync('./vocab.txt',"Please put your vocab list instead of this message. ")
        process.exit(1);
    }
}

const webScrap = async (wordList: string[]) =>{
    let ret: Array<Array<String | Array<String>>> = [];
    for(let i=0; i<wordList.length; i++){
        let element: string = wordList[i];
        let synonyms:String[] = [];
       await fetch(`https://www.thesaurus.com/browse/${element}`).then(async res =>{
         let html = await res.text();
         const $ = cheerio.load(html);

         let table =  $('.ymkoQzz8IAslpOMa23cK ul li')

         
         table.each((j,el) => {
            const nazwa = $(el).text();
            synonyms.push(nazwa);
         })
         ret.push([element,synonyms])
    }
)} return ret
}



const mergeAndSave =  (synonymList: Array<Array<String | Array<String>>>) => {
    fs.writeFileSync("./synonyms.txt","");

    for(let i=0;i<synonymList.length;i++){
        let word = synonymList[i][0];
        let synonyms = synonymList[i][1].toString();
        fs.writeFileSync('./synonyms.txt', `${word}: ${synonyms}\n`, {flag: 'a'})
    }

    console.log('enjoy your szczota learing :)');
    

}


//webScrap(getVocabList()).then(res => console.log(res));

(async () => {
    mergeAndSave(await webScrap(getVocabList()))
})();
