# Siri Shortcuts Setup

Webhook URL: set in `.env` as `WEBHOOK_URL`

---

## Shortcut 1: Track Stop

**Steps in Shortcuts app:**

1. Add action: **Get Current Date**
2. Add action: **Format Date**
   - Date: Current Date
   - Format: Custom
   - Custom format: `yyyy-MM-dd'T'HH:mm:ssXXXXX`
   - → rename output variable to `EndTime`
3. Add action: **Text**
   - Paste this, then tap `EndTime` variable where it says ENDTIME:
   ```
   {"action":"stop","entry":{"endTime":"ENDTIME","notes":""}}
   ```
4. Add action: **Get Contents of URL**
   - URL: (paste webhook URL)
   - Method: POST
   - Headers: add `Content-Type` = `application/json`
   - Request Body: File
   - File: Text (from step 3)
5. Add action: **Show Result**

---

## Shortcut 2: Track Start

**Steps in Shortcuts app:**

1. Add action: **Ask for Input**
   - Question: `Activity?`
   - Input type: Text
   - Allow multiline: off
   - → rename output to `Activity`
2. Add action: **Choose from Menu**
   - Prompt: `Category?`
   - Options: `Strategic`, `Tactical`
   - → rename output to `Category`
3. Add action: **Ask for Input**
   - Question: `Reason?`
   - Input type: Text
   - → rename output to `Reason`
4. Add action: **Get Current Date**
5. Add action: **Format Date**
   - Format: Custom
   - Custom format: `yyyy-MM-dd'T'HH:mm:ssXXXXX`
   - → rename output to `StartTime`
6. Add action: **Text**
   - Build this, inserting variables where marked:
   ```
   {"action":"start","entry":{"activity":"ACTIVITY","startTime":"STARTTIME","category":"CATEGORY","reason":"REASON","notes":""}}
   ```
7. Add action: **Get Contents of URL**
   - Same settings as Stop shortcut
8. Add action: **Show Result**

---

## Shortcut 3: Track Log Complete

**Steps in Shortcuts app:**

1. Add action: **Ask for Input**
   - Question: `Activity?`
   - → rename to `Activity`
2. Add action: **Ask for Input**
   - Question: `Start time?`
   - Input type: Date and Time
   - → rename to `StartTime`
3. Add action: **Format Date**
   - Date: StartTime
   - Format: Custom: `yyyy-MM-dd'T'HH:mm:ssXXXXX`
   - → rename to `StartTimeFormatted`
4. Add action: **Ask for Input**
   - Question: `End time?`
   - Input type: Date and Time
   - → rename to `EndTime`
5. Add action: **Format Date**
   - Date: EndTime
   - Format: Custom: `yyyy-MM-dd'T'HH:mm:ssXXXXX`
   - → rename to `EndTimeFormatted`
6. Add action: **Choose from Menu**
   - Prompt: `Category?`
   - Options: `Strategic`, `Tactical`
   - → rename to `Category`
7. Add action: **Ask for Input**
   - Question: `Reason?`
   - → rename to `Reason`
8. Add action: **Text**
   ```
   {"action":"log_complete","entry":{"activity":"ACTIVITY","startTime":"STARTTIMEFORMATTED","endTime":"ENDTIMEFORMATTED","category":"CATEGORY","reason":"REASON","notes":""}}
   ```
9. Add action: **Get Contents of URL**
   - Same settings as Stop shortcut
10. Add action: **Show Result**
