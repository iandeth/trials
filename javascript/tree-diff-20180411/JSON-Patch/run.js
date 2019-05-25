var jsonpatch = require('fast-json-patch');

var a = [
  {
    "tag": "div",
    "attr": {},
    "child": [
      {
        "tag": "div",
        "attr": { "class":"foo" },
        "child": [
          { "text":"wee" }
        ]
      }
    ]
  }
];

var b = [
  {
    "tag": "p",
    "attr": { "class":"wee" },
    "child": []
  },
  {
    "tag": "div",
    "attr": {},
    "child": [
      {
        "tag": "div",
        "attr": { "class":"foo" },
        "child": [
          { "text":"wee" }
        ]
      }
    ]
  }
]
