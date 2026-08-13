/**
 * Google Apps Script — pings the site whenever the sheet is saved, so edits show
 * up without waiting out the 60s cache window.
 *
 * SETUP
 *  1. Open the Sheet → Extensions → Apps Script.
 *  2. Paste this file over Code.gs.
 *  3. Fill in ENDPOINT and SECRET below.
 *  4. Select `installTrigger` in the function dropdown → Run.
 *     Approve the permissions prompt the first time (it needs "connect to an
 *     external service").
 *  5. Edit any cell. Extensions → Apps Script → Executions should show a run.
 *
 * WHY AN INSTALLABLE TRIGGER
 * A plain `onEdit(e)` function is a *simple* trigger and is not allowed to call
 * external URLs — it would fail silently. `installTrigger` registers an
 * *installable* onChange trigger, which runs with your authorisation and can.
 * onChange also covers row inserts and deletes, not just cell edits.
 */

// Your deployed site. localhost will NOT work — Google has to be able to reach it.
const ENDPOINT = 'https://YOUR-DOMAIN.com/api/revalidate';

// Must match REVALIDATE_SECRET in the site's environment variables.
const SECRET = 'PASTE_THE_SAME_SECRET_HERE';

function notifySite() {
  const response = UrlFetchApp.fetch(ENDPOINT, {
    method: 'post',
    headers: { 'x-revalidate-secret': SECRET },
    muteHttpExceptions: true, // Never let a failed ping break editing.
  });

  console.log('Revalidate ping: %s %s', response.getResponseCode(), response.getContentText());
}

/** Run once by hand to register the trigger. Safe to re-run; it de-duplicates. */
function installTrigger() {
  ScriptApp.getProjectTriggers()
    .filter((trigger) => trigger.getHandlerFunction() === 'notifySite')
    .forEach((trigger) => ScriptApp.deleteTrigger(trigger));

  ScriptApp.newTrigger('notifySite')
    .forSpreadsheet(SpreadsheetApp.getActive())
    .onChange()
    .create();

  console.log('Trigger installed.');
}
