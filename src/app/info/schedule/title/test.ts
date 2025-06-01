/**
 * EXERCISE CAUTION - THIS CODE WAS WRITTEN (MOSTLY) BY CHATGPT
 */

import { calculateRelativeDate } from "./content";

const referenceSunday = new Date("2025-06-08T00:00:00");

const table = `
  last    |           |           |           |           |           |          
  last    |   last    |           |           |           |           |          
  last    |   last    |   last    |           |           |           |          
  last    |   last    |   last    |   last    |           |           |          
  last    |   last    |   last    |   last    |   last    |           |          
  last    |   last    |   last    |   last    |   last    |   last    |          
yesterday |    OTW    |    OTW    |   last    |   last    |   last    |   last   
  today   | yesterday |    OTW    |    LW     |    LW     |    LW     |    LW    
tomorrow  |   today   | yesterday |   this    |   this    |   this    |   this   
  this    | tomorrow  |   today   | yesterday |   this    |   this    |   this   
  this    |   this    | tomorrow  |   today   | yesterday |   this    |   this   
  this    |   this    |   this    | tomorrow  |   today   | yesterday |   this   
  this    |   this    |   this    |   this    | tomorrow  |   today   | yesterday
   NW     |    NW     |    NW     |    NW     |    TW     | tomorrow  |   today  
  next    |   next    |   next    |   next    |    TW     |    TW     | tomorrow 
          |   next    |   next    |   next    |   next    |   next    |   next   
          |           |   next    |   next    |   next    |   next    |   next   
          |           |           |   next    |   next    |   next    |   next   
          |           |           |           |   next    |   next    |   next   
          |           |           |           |           |   next    |   next   
          |           |           |           |           |           |   next   
`.trim().split("\n").map(row => row.split("|").map(cell => cell.trim()));

// Normalize actual values like "this Sunday" → "this", "Sunday over the weekend" → "OTW"
function normalize(value: string | null): string {
  if (!value) return "";
  if (["today", "tomorrow", "yesterday"].includes(value)) return value;

  if (value.includes("over the weekend")) return "OTW";
  if (value.includes("last weekend")) return "LW";
  if (value.includes("this weekend")) return "TW";
  if (value.includes("next weekend")) return "NW";

  return value.split(" ")[0]; // "this Sunday" → "this", "last Tuesday" → "last"
}

export function test_calculateRelativeDate() {
  let mismatches = 0;

  for (let i = 0; i < table.length; i++) {
    const talkedAboutDate = new Date(referenceSunday);
    talkedAboutDate.setDate(talkedAboutDate.getDate() - 7 + i);

    for (let j = 0; j < 7; j++) {
      const todayDate = new Date(referenceSunday);
      todayDate.setDate(todayDate.getDate() + j);

      const expected = table[i][j] ?? "";
      const actualRaw = calculateRelativeDate(talkedAboutDate, todayDate);
      const actual = normalize(actualRaw);

      if (expected !== actual) {
        mismatches++;
        const label = `talkedAbout: ${talkedAboutDate.toDateString()}, today: ${todayDate.toDateString()}`;
        console.log(`[ ERR! ] MISMATCH @ [${i},${j}] - ${label}`);
        console.log(`   Expected: '${expected}'`);
        console.log(`   Actual  : '${actualRaw}'\n`);
      }
    }
  }

  console.log(`[  OK  ] Test finished. Mismatches: ${mismatches}`);
}
