import { expect } from "test/support/setup";
import * as sinon from "sinon";
import SomeApi from "src/model/some-api";

describe("SomeApi", function () {
  beforeEach("create instance", function () {
    this.m = new SomeApi();
  });

  describe("#get", function () {
    const items = [
      { id: 1, text: "foo" },
      { id: 2, text: "bar" },
      { id: 3, text: "buz" },
    ];

    it("fetches some items array", function () {
      const p = this.m.get();
      return expect(p).to.eventually.eql(items); // return が重要
    });

    describe("with sync/await", function () {
      it("fetches some items array", async function () {
        const r = await this.m.get();
        expect(r).to.eql(items);
      });
    });

    describe("with sinon", function () {
      before("setup mock api server", function () {
        this.server = sinon.useFakeServer();

        const url =
          "https://storage.googleapis.com/kaizen-cse-public/tmp/iandeth/20200619-mocha/some.json";
        const body = `{"itemCount":3,"items":[{"id":1,"text":"foo"},{"id":2,"text":"bar"},{"id":3,"text":"buz"}]}`;
        const res = [200, { "Content-Type": "application/json" }, body];
        this.server.respondWith(url, res);
      });

      after("reset mock api server", function () {
        this.server.restore();
      });

      it("fetches some items array", async function () {
        const p = this.m.get();

        this.server.respond();
        expect(this.server.requests.length).to.eq(1);

        return expect(p).to.eventually.eql(items);
      });
    });
  });
});
