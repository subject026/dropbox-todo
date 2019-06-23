import { Dropbox } from "dropbox";

import DBX from "./DBX";

let saveTimeout;

export function getAuthenticationLink() {
  const dbx = new Dropbox({ clientId: "e45k6j9mvumew4x" });
  const authUrl = dbx.getAuthenticationUrl(APP_URL);
  return authUrl;
}

/**
 * Returns array of remote app folder file details
 */
export async function getFilesList() {
  const dbx = DBX.getInstance();
  let res;
  try {
    res = await dbx.filesListFolder({ path: "" });
    return res.entries;
  } catch (err) {
    console.log(err);
  }
}

/**
 * Returns parsed JSON file from remote DB app folder
 */
export async function getData(path) {
  const dbx = DBX.getInstance();
  let data;
  try {
    data = await dbx.filesDownload({ path });
  } catch (err) {
    console.log(err);
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(JSON.parse(reader.result));
    };
    reader.onerror = () => {
      reject(new Error("Error reading json file"));
    };
    reader.readAsText(data.fileBlob);
  });
}

/**
 * Save todos data as JSON file to DB app folder
 */
export async function saveData(data) {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(function() {
    postData(data);
  }, 3000);
}

function postData(data) {
  const dbx = DBX.getInstance();
  const blob = new Blob([JSON.stringify(data)], {
    type: "application/json"
  });
  let res;
  try {
    res = dbx.filerequestsUpdate({
      path: `/${Date.now()}_todos.json`,
      contents: blob
    });
    return res;
  } catch (err) {
    return err;
  }
}