import Dog from "src/model/dog";

const runClasses = () => {
  let msg = "hello";
  console.log(msg);

  // type error
  //msg = 2;

  const sam = new Dog("sam");
  console.log("name", sam.name);

  sam.name = "willy";
  console.log("name changed", sam.name);

  const mr = sam.move(2);
  console.log("move return", mr);

  sam.bark();

  // readonly error
  //sam.legs = 8;
  //sam.name = "sammy";
};

const runJQ = () => {
  // global jquery working
  $(() => {
    $("<h2>jquery working!</h2>").insertAfter("h1");
  });
};

const runAsync = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("waited 100ms"), 100);
  });
};

// main scope
Promise.resolve()
  .then(runClasses)
  .then(runJQ)
  .then(async () => {
    const r = await runAsync();
    console.log("#runAsync returns:", r);
  });
