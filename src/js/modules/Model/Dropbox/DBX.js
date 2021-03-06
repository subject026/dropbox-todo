import { Dropbox } from "dropbox";

import { getTokenLocal } from "../";

let instance;

export default {
  getInstance: function() {
    if (!instance) {
      instance = new Dropbox({ accessToken: getTokenLocal(), fetch });
    }
    return instance;
  }
};
