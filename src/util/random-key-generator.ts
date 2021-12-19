export class RandomKeyGenerator {
  public generate(length: number, range?: string): string {
    let key = "";
    const characters = range || "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      key += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return key;
  }
}
