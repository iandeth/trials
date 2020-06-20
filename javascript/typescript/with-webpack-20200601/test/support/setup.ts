import * as _chai from "chai";
// use require instead of import to avoid typescript's "implicitly has any type" error
// eslint-disable-next-line @typescript-eslint/no-var-requires
const chaiAsPromised = require("test/support/chai-as-promised");
_chai.use(chaiAsPromised);

export const chai = _chai;
export const expect = chai.expect;
