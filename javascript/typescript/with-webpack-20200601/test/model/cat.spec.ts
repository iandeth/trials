import { expect } from "test/support/setup";
import Cat from "src/model/cat";

describe("Cat", function () {
  beforeEach("create instance", function () {
    this.m = new Cat("fluffy");
  });

  describe("new", function () {
    it("accepts name, has 2 legs", function () {
      expect(this.m.name).to.eq("fluffy");
      expect(this.m.legs).to.eq(2);
    });
  });

  describe("#bark", function () {
    it('returns "mew"', function () {
      expect(this.m.bark()).to.eq("mew");
    });
  });
});
