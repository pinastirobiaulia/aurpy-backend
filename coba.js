const mhs = {
  nama: "reymond",
  nim: "191011450014",
  kelas: "04TPLE001",
};

// destructuring object
const { nama, nim, kelas } = mhs;

const fruit = ["mangga", "apel", "jeruk"];

// destructruing array
const [mangga, ...apelNjeruk] = fruit;

const string1 = "test3";
const string2 = "test2";
const string3 = string1 || string2;

// console.log(apelNjeruk)

// const arr = (tiga, empat5, ...arrayAngka) => {
//   return arrayAngka
// }

// console.log(arr(3,45,34,4,5,6,6,6,7,7,7,7,43,3,3,3,2,4,4,4))

const arr1 = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
let arr2;
let angka = [1, 2, 3, 4, 5, 6];
// arr2 = [...arr1];  // Change this line
// arr3 = {...arr2}
// console.log(...angka);

const [dua, satu, ...sisanya] = angka;

// console.log(satu, dua, sisanya)

const HIGH_TEMPERATURES = {
  yesterday: 75,
  today: 77,
  tomorrow: 80,
};

// Only change code below this line

// const { today: highToday, tomorrow: highTomorrow } = HIGH_TEMPERATURES
// Only change code above this line

// console.log(highTomorrow)

const LOCAL_FORECAST = {
  yesterday: { low: 61, high: 75 },
  today: { low: 64, high: 77 },
  tomorrow: { low: 68, high: 80 },
};

// Only change code below this line

const {
  today: { low: lowToday, high: highToday },
} = LOCAL_FORECAST;
// console.log(highToday)

// const source = [1,2,3,4,5,6,7,8,9,10];
// function removeFirstTwo(list) {
//   const [a,b, ...arr] = list
//   return arr;
// }
// const arr = removeFirstTwo(source);

// console.log(arr)

const stats = {
  max: 56.78,
  standard_deviation: 4.34,
  median: 34.54,
  mode: 23.87,
  min: -0.75,
  average: 35.85,
};

// Only change code below this line
const half = ({ max, min }) => (max + min) / 2.0;
// Only change code above this line
// console.log(half(stats))

const result = {
  success: ["max-length", "no-amd", "prefer-arrow-functions"],
  failure: ["no-var", "var-on-top", "linebreak"],
  skipped: ["no-extra-semi", "no-dup-keys"],
};
function makeList(arr) {
  // Only change code below this line
  const failureItems = [];
  for (let i = 0; i < arr.length; i++) {
    failureItems.push(`<li class="text-warning">${arr[i]}</li>`);
  }
  // Only change code above this line

  return failureItems;
}

const failuresList = makeList(result.failure);

// console.log(failuresList)

const createPerson = (name, age, gender) => {
  // Only change code below this line
  return {
    name,
    age,
    gender,
  };
  // Only change code above this line
};

// console.log(createPerson('ignas', 20, 'men'))

class Vegetable {
  constructor(name) {
    return { name };
  }
}
const carrot = new Vegetable("carrot");
// console.log(carrot.name); // Should display 'carrot'

// C = 5/9 * (F - 32) and F = C * 9.0 / 5 + 32
class Thermostat {
  constructor(scaleF) {
    this._scaleF = scaleF;
  }

  set temperature(scaleC) {
    this._scaleF = (scaleC * 9.0) / 5 + 32;
  }

  get temperature() {
    return (5 / 9) * (this._scaleF - 32);
  }
}

const thermos = new Thermostat(76); // Setting in Fahrenheit scale
let temp = thermos.temperature; // 24.44 in Celsius
// console.log(temp);
thermos.temperature = 26;
temp = thermos.temperature; // 26 in Celsius
// console.log(temp);

const c = (5 / 9) * (76 - 32);

const ages = [32, 33, 16, 40];
const result2 = ages.filter(checkAdult);

function checkAdult(age) {
  return age >= 18;
}

// console.log(result2);

// coba object.assign()
const target = { a: 1, b: 2 };
const source = { c: 3, d: 4 };

Object.assign(target, source);
// console.log(target);

const num = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12];

// console.log(num.sort());
function test(num) {
  for (let i = 1; i < num.length + 1; i++) {
    if (num[i] + 1 !== num[i + 1]) {
      return num[i + 1];
    }
  }
  return null;
}

// console.log(test(num));

function test(num) {
  let str = num.toString();
  return Array.from(str, Number).reverse();
}

// console.log(test(35231));

let haystack_1 = [
  "3",
  "123124234",
  undefined,
  "needle",
  "world",
  "hay",
  2,
  "3",
  true,
  false,
];
let haystack_2 = [
  "283497238987234",
  "a dog",
  "a cat",
  "some random junk",
  "a piece of hay",
  "needle",
  "something somebody lost a while ago",
];
let haystack_3 = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  8,
  7,
  5,
  4,
  3,
  4,
  5,
  6,
  67,
  5,
  5,
  3,
  3,
  4,
  2,
  34,
  234,
  23,
  4,
  234,
  324,
  324,
  "needle",
  1,
  2,
  3,
  4,
  5,
  5,
  6,
  5,
  4,
  32,
  3,
  45,
  54,
];

const findNeedle = (haystack) => {
  let result = undefined;
  for (let i = 0; i < haystack.length; i++) {
    haystack[i] === "needle"
      ? (result = `found the needle at position ${i}`)
      : result;
  }
  return result;
};

// console.log(findNeedle(haystack_1));
// console.log(findNeedle(haystack_2));
// console.log(findNeedle(haystack_3));

/* Write a function named setAlarm which receives two parameters. The first parameter, employed, is true whenever you are employed and the second parameter, vacation is true whenever you are on vacation.

The function should return true if you are employed and not on vacation (because these are the circumstances under which you need to set an alarm). It should return false otherwise. Examples: */
function setAlarm(employed, vacation) {
  return employed && !vacation ? true : false;
}

// console.log(setAlarm(true, true));
// console.log(setAlarm(false, true));
// console.log(setAlarm(false, false));
// console.log(setAlarm(true, false));

/* A hero is on his way to the castle to complete his mission. However, he's been told that the castle is surrounded with a couple of powerful dragons! each dragon takes 2 bullets to be defeated, our hero has no idea how many bullets he should carry.. Assuming he's gonna grab a specific given number of bullets and move forward to fight another specific given number of dragons, will he survive?
Return True if yes, False otherwise :) */

function hero(bullets, dragons) {
  return dragons * 2 <= bullets ? true : false;
}

// console.log(hero(10, 5));
// console.log(hero(7, 4));
// console.log(hero(4, 5));
// console.log(hero(100, 40));
// console.log(hero(1500, 751));
// console.log(hero(0, 1));

function areYouPlayingBanjo(name) {
  // Implement me
  let regex = new RegExp("r", "i");
  console.log(regex.test(name[0]));
  return regex.test(name[0])
    ? `${name} plays banjo`
    : `${name} does not play banjo`;
}

// console.log(areYouPlayingBanjo("bravo"));

function DNAtoRNA(dna) {
  return dna.replace(/T/g, "U");
}

// console.log(DNAtoRNA("TTTT"));

function summation(sum) {
  let result = 0;
  for (let i = 1; i <= sum; i++) {
    result += i;
  }
  return result;
}

// console.log(summation(8));

/* Given a string of digits, you should replace any digit below 5 with '0' and any digit 5 and above with '1'. Return the resulting string. */

function fakeBin(x) {
  const num = Array.from(x, Number);
  for (let i = 0; i < num.length; i++) {
    if (num[i] < 5) {
      num[i] = 0;
    } else {
      num[i] = 1;
    }
  }
  return num.toString().replace(/,/g, "");
}
// console.log(fakeBin("45385593107843568"));

// const test2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// console.log(test2.toString());

// const result1 = 15;

// console.log(parseFloat(num1));
// console.log(typeof num1);

/* Our football team finished the championship. The result of each match look like "x:y". Results of all matches are recorded in the collection.

For example: ["3:1", "2:2", "0:1", ...]

Write a function that takes such collection and counts the points of our team in the championship. Rules for counting points for each match:

if x > y: 3 points
if x < y: 0 point
if x = y: 1 point
Notes:

there are 10 matches in the championship
0 <= x <= 4
0 <= y <= 4 */
function points(games) {
  // const num = Array.from(games.split(":"), Number);
  const result = [];
  let point = 0;
  for (let i = 0; i < games.length; i++) {
    result.push(games[i].split(":"));
  }
  for (let i = 0; i < result.length; i++) {
    // for (let j = 0; j < result[i].length; j++) {
    const num = Array.from(result[i], Number);
    // }
    // console.log(num[0], num[1]);
    if (num[0] > num[1]) {
      point += 3;
    } else if (num[0] === num[1]) {
      point += 1;
    } else {
      point += 0;
    }
  }
  // console.log(typeof num);
  return point;
}

// console.log(
//   points(["1:0", "2:0", "3:0", "4:0", "2:1", "1:3", "1:4", "2:3", "2:4", "3:4"])
// );

function sumMix(x) {
  let result = 0;
  for (let i = 0; i < x.length; i++) {
    if (typeof x[i] === "string") {
      x[i] = parseInt(x[i]);
    }
    result += x[i];
  }
  return result;
}

// console.log(typeof "sd" === "string");
// console.log(sumMix(["3", 6, 6, 0, "5", 8, 5, "6", 2, "0"]));

function updateLight(current) {
  switch (current) {
    case "green":
      current = "yellow";
      break;
    case "yellow":
      current = "red";
      break;
    case "red":
      current = "green";
      break;
    default:
      current;
  }
  return current;
}

// console.log(updateLight("yellow"));
// const num2 = new Array(1, 2, 3, 4, 5);
// console.log(num2);

function hoopCount(n) {
  //your code goes here
  return n >= 10
    ? "Great, ow monve on to tricks"
    : "Keep at it until you get it";
}

// console.log(hoopCount(11));

const rps = (p1, p2) => {
  let result = "";
  switch (p1) {
    case "scissors":
      p2 === "scissors"
        ? (result = "Draw!")
        : p2 === "rock"
        ? (result = "Player 2 won!")
        : (result = "Player 1 won!");
      break;
    case "paper":
      p2 === "paper"
        ? (result = "Draw!")
        : p2 === "rock"
        ? (result = "Player 1 won!")
        : "Player 2 won!";
      break;
    case "rock":
      p2 === "rock"
        ? (result = "Draw!")
        : p2 === "paper"
        ? (result = "Player 2 won!")
        : "Player 1 won!";
      break;
    default:
      p1 === "" && (p2 === "scissors" || "rock" || "paper")
        ? (result = "Player 2 won!")
        : p2 === "" && p1 !== ""
        ? (result = "Player 1 won!")
        : result;
  }

  return result;
};

console.log(rps("scissors", ""));
// console.log("p" === "p");
