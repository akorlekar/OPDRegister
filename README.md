# OPD Register — laptop app

Clinic reception software modelled on a traditional OPD desktop register.

**Reception Counter** has five tabs:
- **For New Patient** — registration form with Add New, Save Data, Update Data, Delete Data, Cancel and Exit buttons, plus a searchable patient list underneath
- **Session Generated List** — everything you entered since logging in
- **Revisit Patient List** — add the next day's visit for a returning patient (charges are copied from the last visit)
- **Show Today's Cash** — cash and online money received on any date
- **Pending Payments** — unpaid balances; enter what was received and click Save

Also: **Reports** (date-range summary and Excel export) and **Settings & Backup** (clinic name, staff logins, backup and restore).

Every patient has Diagnosis and Patient History boxes with no length limit. Mobile number accepts digits only, maximum 10.

## First time you open it

The app asks you to create the first login: your clinic name (optional), your name and a 4 to 6 digit PIN. That person becomes the **admin** and can add or remove other staff in Settings. Nothing is pre-filled and no name is built into the app.

## Way 1 — Use it right now (no install)

1. Unzip this folder.
2. Double-click **index.html** (opens in Chrome or Edge).

In this mode the data is stored inside that browser. Always open it in the same browser, and do not clear "cookies and site data". Save a backup file regularly from Settings & Backup.

## Way 2 — Proper Windows app, built free by GitHub

1. Sign in at https://github.com and create a **Public** repository (tick "Add a README file").
2. Click **Add file → Upload files**. Drag in `index.html`, `main.js`, `preload.js`, `package.json`, `icon.png`, `.gitignore`, `.nojekyll`. (The `.github` folder is skipped by the uploader, see next step.) Click **Commit changes**.
3. Click the **Actions** tab, then **set up a workflow yourself**. Delete the sample text, paste the content of `.github/workflows/build-windows.yml`, and click **Commit changes**.
4. Wait about 5 to 8 minutes for a green tick. Click the run, scroll to **Artifacts**, download **OPD-Register-Windows**.
5. Unzip it. Double-click `OPD-Register-Setup.exe` to install (desktop shortcut is created) or use `OPD-Register-Portable.exe` without installing.

Windows may say "Windows protected your PC" because the app is unsigned. Click **More info → Run anyway**.

To update later: replace the changed file(s) in the repository. GitHub rebuilds automatically.

## Where your data is stored (installed app)

`Documents\OPD Register Data\opd-data.json`

This folder is **outside the app**, so **uninstalling or reinstalling never deletes your data**. After reinstalling, open the app and everything is there. The same folder also holds:
- `opd-data.previous.json` — the version before the last save
- `Backups\` — one automatic copy per day (last 60 days) and a copy every time you use **Exit & Backup**

To move to a new computer, copy the whole `OPD Register Data` folder to the new computer's Documents folder before opening the app. Also copy it to a pen drive now and then.

## Notes

- Staff PINs identify who made each entry. They are not strong security, so lock the laptop with a Windows password.
- If the admin forgets the PIN: open `opd-data.json` in Notepad, find the `"staff"` section and read or change the `"pin"` value, then save. (Close the app first.)
- Exit & Backup saves a backup copy and closes the app. It does not email the backup.
