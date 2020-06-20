export default class SomeApi {
  async get(): Promise<Record<string, unknown>> {
    const url =
      "https://storage.googleapis.com/kaizen-cse-public/tmp/iandeth/20200619-mocha/some.json";
    return $.get(url).then((d: any) => d.items);
  }
}
