const SHEET_NAME = "Entries";

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const action = body.action;
    const entry = body.entry || {};
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);

    if (!sheet) {
      throw new Error('Missing sheet named "Entries"');
    }

    if (action === "start") {
      const start = new Date(entry.startTime);
      const row = [
        entry.activity,
        entry.category,
        entry.reason,
        start,
        start,
        "",
        "",
        "",
        "Open",
        entry.notes || "",
        createEntryId()
      ];

      sheet.appendRow(row);
      formatRow(sheet, sheet.getLastRow());
      return json({ ok: true, action: "start", entryId: row[10] });
    }

    if (action === "log_complete") {
      const start = new Date(entry.startTime);
      const end = new Date(entry.endTime);
      const mins = durationMinutes(start, end);
      const row = [
        entry.activity,
        entry.category,
        entry.reason,
        start,
        start,
        end,
        mins,
        durationHours(mins),
        "Closed",
        entry.notes || "",
        createEntryId()
      ];

      sheet.appendRow(row);
      formatRow(sheet, sheet.getLastRow());
      return json({ ok: true, action: "log_complete", entryId: row[10] });
    }

    if (action === "stop") {
      const end = new Date(entry.endTime);
      const lastRow = sheet.getLastRow();

      if (lastRow <= 1) {
        throw new Error("No open entry found to stop");
      }

      const values = sheet.getRange(2, 1, lastRow - 1, 11).getValues();

      for (let i = values.length - 1; i >= 0; i -= 1) {
        if (values[i][8] !== "Open") {
          continue;
        }

        const rowNumber = i + 2;
        const start = values[i][4];
        const mins = durationMinutes(start, end);

        sheet.getRange(rowNumber, 6).setValue(end);
        sheet.getRange(rowNumber, 7).setValue(mins);
        sheet.getRange(rowNumber, 8).setValue(durationHours(mins));
        sheet.getRange(rowNumber, 9).setValue("Closed");

        if (entry.notes) {
          sheet.getRange(rowNumber, 10).setValue(entry.notes);
        }

        formatRow(sheet, rowNumber);
        return json({ ok: true, action: "stop", entryId: values[i][10] });
      }

      throw new Error("No open entry found to stop");
    }

    if (action === "delete_latest") {
      const lastRow = sheet.getLastRow();

      if (lastRow <= 1) {
        throw new Error("No entry found to delete");
      }

      const entryId = sheet.getRange(lastRow, 11).getValue();
      sheet.deleteRow(lastRow);
      return json({ ok: true, action: "delete_latest", entryId: entryId });
    }

    throw new Error("Unsupported action");
  } catch (error) {
    return json({ ok: false, error: String(error) });
  }
}

function durationMinutes(start, end) {
  const ms = end.getTime() - start.getTime();

  if (ms < 0) {
    throw new Error("End time cannot be earlier than start time");
  }

  return Math.round(ms / 60000);
}

function durationHours(minutes) {
  return Math.round(minutes / 60 * 4) / 4;
}

function createEntryId() {
  const now = new Date();
  const timestamp = Utilities.formatDate(
    now,
    Session.getScriptTimeZone(),
    "yyyyMMdd-HHmmss"
  );
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
  return timestamp + "-" + random;
}

function formatRow(sheet, rowNumber) {
  sheet.getRange(rowNumber, 4).setNumberFormat("yyyy-mm-dd");
  sheet.getRange(rowNumber, 5).setNumberFormat("h:mm AM/PM");
  sheet.getRange(rowNumber, 6).setNumberFormat("h:mm AM/PM");
  sheet.getRange(rowNumber, 7).setNumberFormat("0");
  sheet.getRange(rowNumber, 8).setNumberFormat("0.00");
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
