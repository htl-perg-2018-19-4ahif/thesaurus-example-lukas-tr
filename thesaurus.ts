const LineByLineReader = require("line-by-line");
const readline = require("readline");

const findSynonyms = (args: string[]) => {
  return new Promise(resolve => {
    const lr = new LineByLineReader("./OpenThesaurus/openthesaurus.txt");
    let matchFound = false;
    if (args.length === 0) {
      console.error("Please specify words");
      return resolve();
    }
    lr.on("error", function(err: Error) {
      console.error(err);
      return resolve();
    });
    lr.on("line", function(line: string) {
      if (/#/.test(line.trim())) return;
      const lineArr = line.split(";");
      for (let i = 0; i < lineArr.length; i++) {
        const word = lineArr[i];
        for (const arg of args) {
          if (word.toLowerCase().indexOf(arg.toLowerCase()) !== -1) {
            matchFound = true;
            console.log(`${word}:`);
            for (const w of lineArr.filter(w => w !== word)) {
              console.log(`  ${w}`);
            }
          }
        }
      }
    });
    lr.on("end", function() {
      if (!matchFound) {
        console.log("No matches found");
      }
      return resolve();
    });
  });
};

const args = process.argv.slice(2);

if (args.indexOf("-i") !== -1) {
  console.log("Input \\q or CTRL C to quit");
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });
  rl.on("line", function(line: string) {
    if (line.trim() === "\\q") process.exit();
    findSynonyms(line.split(" ").filter(s => s.length));
  });
} else {
  findSynonyms(args);
}
