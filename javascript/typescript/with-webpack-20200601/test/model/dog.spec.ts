import { expect } from "test/support/setup";
import Dog from "src/model/dog";

describe("Dog", function () {
  beforeEach("create instance", function () {
    this.m = new Dog("sam");
  });

  describe("new", function () {
    it("accepts name, has 4 legs", function () {
      expect(this.m.name).to.eq("sam");
      expect(this.m.legs).to.eq(4);
    });
  });

  describe("#bark", function () {
    it('returns "bow wow"', function () {
      expect(this.m.bark()).to.eq("bow wow");
    });
  });

  describe("#move", function () {
    it("returns steps with 4 legs", function () {
      expect(this.m.move(3)).to.eql({ steps: 3, legs: 4 });
    });
  });
});
