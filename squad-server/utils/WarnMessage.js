/**SquadJS Utility for building Warn messages
 *
 * @bombitmanbomb
 */
export class WarnMessage {
  static character_limit = 215
  /**
   *Creates an instance of WarnMessage.
   * @param {*} rcon the SquadJS RCON object.
   */
  constructor(rcon) {
    this.message = []
    this.rcon = rcon
  }
  /**
   * Get the raw message as a composed string.
   */
  toString() {
    return this.message.join("")
  }
  /**
   * Add text to the message.
   */
  add(message = "") {
    this.message.push(message)
    return this
  }
  /**
   * Add text to the message, Appends a newline.
   */
  addLine(message = "") {
    this.add(message + "\n")
    return this
  }
  /**
   * Returns true if the message is too long for a single warn.
   */
  get needsMulti() {
    return this.toString().length > WarnMessage.character_limit
  }
  /**Build the message up into chunks.
   *
   * @return {Generator<string, string, unknown>}
   */
  *multi() {
    let responseString = ""
    for (const item of this.message) {
      //TODO: Add smart line split
      if (item.length > WarnMessage.character_limit) throw `Line exceeds ${WarnMessage.character_limit} characters.`;
      let newLength = responseString.length + item.length;
      if (newLength > WarnMessage.character_limit) {
        yield responseString;
        responseString = item;
        continue;
      } else {
        responseString += item
      }
    }
    if (responseString != "") yield responseString;
  }
  /**Send the warning to multiple Users.
   *
   * @param {string[]} users
   */
  async sendMultiple(users) {
    for (let userId of users) {
      this.send(userId)
    };
  }
  /**Send the warning to a User.
   *
   * @param {string} userId
   */
  async send(userId) {
    for (let message of this.multi()) {
      await this.rcon.warn(userId, message)
    }
  }
}
