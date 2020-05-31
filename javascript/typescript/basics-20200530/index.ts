import Dog from "./src/model/dog";

let msg = "hello";
console.log(msg);

// type error
//msg = 2;

const sam = new Dog("sam");
console.log("name", sam.name);

const mr = sam.move(2);
console.log("move return", mr);

// readonly error
//sam.legs = 8;
//sam.name = "sammy";
