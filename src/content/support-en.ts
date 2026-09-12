import type { SupportCopy } from "@/content/support-types";

export const supportEn: SupportCopy = {
  title: "POKIT Support",
  description:
    "About POKIT, screen guide, FAQ, and contact. An iOS routine app you can use without an account.",
  kicker: "Support",
  lead: [
    "POKIT is an iOS app for keeping today's routines light and setting your own focus window.",
    "You do not need to fill a tight timetable. Pick only the routines you want today, then follow them in order. Thoughts go into notes and to-dos, books you want to read go into the bookshop, and when the day ends they stay as a small mark in History.",
    "You can start without signing up. Except for the app name POKIT, on-screen copy supports Korean, English, and Japanese, and follows the device language.",
  ],
  appStore: "View on the App Store",
  tocLabel: "Jump to",
  sections: [
    {
      id: "about",
      title: "About the app",
      blocks: [
        {
          type: "p",
          text: "POKIT is built so you do not have to cram tasks onto a calendar or burn out matching a minute-by-minute schedule.",
        },
        {
          type: "p",
          text: "Decide what to do today, and in what order. Focus runs inside the start and wrap-up times you set. Mark what matters with a highlighter underline, and close what is done. Empty time is not a failure.",
        },
        {
          type: "p",
          text: "The first time you open the app, you set when your day starts and ends. After that, you can change it anytime in Settings → Start & wrap-up.",
        },
        {
          type: "p",
          text: "For a closer look at each screen, open Settings → User guide, or Quick look at POKIT in Today's tray.",
        },
      ],
    },
    {
      id: "screens",
      title: "Screens",
      blocks: [
        { type: "h3", text: "Bottom tabs" },
        {
          type: "list",
          items: [
            "Today: keep the routines you will focus on, and see them as a list inside start~wrap-up. A one-line note of encouragement sits next to the date and changes each day.",
            "Routines: browse health, productivity, and everyday routines, search them, and group them like sticky notes.",
            "My routines: make Daily, Weekend, and your own groups, pick weekdays, then use Apply to bring them into Today.",
            "History: look back at completed routines and focus by week or month.",
            "Story: if a routine in an article stays with you, save it and add it to your day.",
          ],
        },
        { type: "h3", text: "Modes at the top of Today" },
        {
          type: "p",
          text: "Separate from the bottom tabs, you can change modes at the top of the Today screen.",
        },
        {
          type: "list",
          items: [
            "Daily: the default screen with Today's tray and the list.",
            "Lock-screen memo: write a short memo for the lock screen.",
            "Note: write longer thoughts for the day. You can attach photos, use bullets or numbers, and share.",
            "Reading: keep books you want to read and log progress. (Bookshop)",
          ],
        },
        {
          type: "p",
          text: "Tap the to-do icon in the header to jump to that day's tasks. It is a light place for the day's to-dos, apart from routines.",
        },
      ],
    },
    {
      id: "features",
      title: "Main features",
      blocks: [
        { type: "h3", text: "Today's tray" },
        {
          type: "list",
          items: [
            "Add today's routines in order of what matters.",
            "Use Add routines to pick several at once, or Create a new routine to make one.",
            "Importance is a highlighter underline on the title in the color you pick.",
            "A mint check in a black circle marks done. Tap again to undo.",
            "Expand a row to see the summary, time, and template (tasks, memo, value log, and more). The slider icon opens full details.",
            "If the tray has two or more items, press and hold to reorder.",
            "Today has no separate Start button. Focus starts on its own when a routine is in the tray.",
          ],
        },
        { type: "h3", text: "Focus window (start and wrap-up)" },
        {
          type: "list",
          items: [
            "Tap the time in the header to set when the day starts and wraps up.",
            "You can set midnight, AM/PM, or the next day.",
            "If wrap-up is earlier than start, the day continues into the next calendar day. (Example: start at 11 PM, wrap up at 2 AM the next day.)",
            "When the focus window ends, the tray and focus state are cleared, unfinished flow wraps up, and it can remain in History.",
            "In Settings → Start & wrap-up, turn on Keep the tray after the day ends to leave items in the tray longer.",
          ],
        },
        { type: "h3", text: "Making routines and groups" },
        {
          type: "list",
          items: [
            "Search the list in the Routines tab and sort it into sticky-note groups.",
            "Use + to make a new routine or a new group.",
            "Expand an item to pick importance (highlighter underline) and open details.",
            "Last 30 days · N times is how often you added it to Today.",
            "You can edit or delete a group's name and description. Moving, hiding, or deleting items depends on the type.",
          ],
        },
        { type: "h3", text: "Routine templates" },
        {
          type: "p",
          text: "When you create a routine or expand a Today row, you can use these styles.",
        },
        {
          type: "list",
          items: [
            "Task check: check tasks off one by one.",
            "Quick memo: write freely.",
            "Value log: enter a number such as weight or sleep, or adjust it with ±, and it saves right away.",
            "Fill a count: fill the target count with −/+.",
            "Timed reminder: check done at the times you set.",
          ],
        },
        {
          type: "p",
          text: "You can also use purpose-built routines such as health intake, water, weight, reading, notes, and reflection.",
        },
        { type: "h3", text: "My routines" },
        {
          type: "list",
          items: [
            "Daily fixed routines and Weekend fixed routines come built in.",
            "Make your own group, pick the days (Mon~Sun), then turn on Apply to add them to Today's tray on those days.",
            "When it is on, it shows Applying. Tap again to turn it off.",
            "When the focus window ends, Apply fades. Change the focus time on Today, then apply again.",
            "If Weekend fixed routines stay applied, they land on Today automatically on the days you picked (Saturday and Sunday by default).",
          ],
        },
        { type: "h3", text: "To-dos, notes, reading, lock-screen memo" },
        {
          type: "list",
          items: [
            "To-dos: organize that day's tasks apart from routines. Importance underline, subtasks, time, copy, and share are supported.",
            "Notes: keep a longer record of the day. You can edit the title, attach photos, use lists, and share.",
            "Reading (Bookshop): keep books you want to read and log progress.",
            "Lock-screen memo: write a short memo to see on the lock screen.",
          ],
        },
        { type: "h3", text: "History and Story" },
        {
          type: "list",
          items: [
            "History: switch week/month view, move to the previous or next period, and look back at completions and focus.",
            "Story: while reading a web article, tap Save to routines to store it in the Routines tab right away.",
          ],
        },
        { type: "h3", text: "Notifications" },
        {
          type: "p",
          text: "Turn them on in Settings → Notifications, or on the Start & wrap-up screen.",
        },
        {
          type: "list",
          items: [
            "Day-start notification: alerts you at the Day start time you set.",
            "Look-back notification: asks you to review today's progress at the time you set.",
            "Unfinished notification: if anything is still open at the time you set, it tells you how many.",
            "Timed reminders you set on items such as routines, doses, or water can also fire.",
          ],
        },
        {
          type: "p",
          text: "If POKIT is in Scheduled Summary in iOS Settings, the alert time can shift later.",
        },
        { type: "h3", text: "Home screen widget" },
        {
          type: "p",
          text: "Add a POKIT widget to the Home Screen to see today's tray without opening the app.",
        },
        { type: "h3", text: "Display and type" },
        {
          type: "list",
          items: [
            "Light / Dark theme",
            "Type size: Small, Default, Large",
            "Typeface: City-pop round, handwriting note, vinyl serif, and more",
          ],
        },
      ],
    },
    {
      id: "howto",
      title: "How to use it",
      blocks: [
        {
          type: "list",
          items: [
            "If it is your first time, set the day's start and wrap-up, then tap Start.",
            "Browse the Routines tab or make a new routine.",
            "In My routines, pick days and turn on Apply, or add them right away with Add routines on Today.",
            "Leave a highlighter underline on what matters, and mark done as you go.",
            "Put stray tasks in To-dos or Notes, and lock-screen words in Lock-screen memo.",
            "When the day ends, look back by week or month in History.",
          ],
        },
        {
          type: "p",
          text: "For exact button placement, see Settings → User guide in the app.",
        },
      ],
    },
    {
      id: "faq",
      title: "FAQ",
      blocks: [
        {
          type: "faq",
          q: "Where is my data stored?",
          a: "It is stored locally on the device. There is no sign-up or cloud login. If you delete the app or change devices, the data may not come back, so copy or share anything important first.",
        },
        {
          type: "faq",
          q: "Do I need the internet?",
          a: "Core features run locally. Some parts, such as reading web stories or update notices, may need a network.",
        },
        {
          type: "faq",
          q: "Do I need an account?",
          a: "No. Install the app with your Apple ID and you can start right away.",
        },
        {
          type: "faq",
          q: "There is no Start button on Today.",
          a: "That is expected. Focus starts on its own when a routine is in the tray.",
        },
        {
          type: "faq",
          q: "Can I use notes, to-dos, and reading with Today's tray?",
          a: "Yes. Switch with the modes at the top of Today and the to-do icon. Modes only change the Today experience. They are not the same as moving between bottom tabs.",
        },
        {
          type: "faq",
          q: "Can I see completed items again?",
          a: "Yes. You can see the done marks on Today and look back by week or month in History.",
        },
        {
          type: "faq",
          q: "I applied My routines, but they are not on Today.",
          a: "Check that Apply is on, and that today is one of the applied days. If the focus window already ended, change the focus time on Today and apply again.",
        },
        {
          type: "faq",
          q: "I am not getting notifications.",
          a: "In iPhone Settings → Notifications → POKIT, make sure alerts are allowed. Also check that the alert is on in the app under Settings → Notifications. If POKIT is in Scheduled Summary, the time can shift later.",
        },
        {
          type: "faq",
          q: "I want to change the language.",
          a: "The app follows the device language. Korean for Korean, Japanese for Japanese, and English otherwise. Change it in iPhone Settings → General → Language & Region, or in the POKIT app language settings.",
        },
        {
          type: "faq",
          q: "Can I use it on Android?",
          a: "POKIT is an iOS app for now.",
        },
        {
          type: "faq",
          q: "I want to start my data over.",
          a: "Use Settings → Reset app data. Saved schedules, routines, stats, goals, and scheduled alerts are all deleted and cannot be undone.",
        },
      ],
    },
    {
      id: "troubleshoot",
      title: "Troubleshooting",
      blocks: [
        {
          type: "issue",
          title: "An item will not save",
          items: [
            "Force-quit the app, then open it again.",
            "Check that the device has enough storage.",
            "An item in an active focus session may block delete or some edits. Finish focus, then try again.",
          ],
        },
        {
          type: "issue",
          title: "The screen does not look up to date",
          items: [
            "Switch the mode at the top of Today once, then check again.",
            "Relaunch the app.",
            "Make sure POKIT is the latest version on the App Store.",
          ],
        },
        {
          type: "issue",
          title: "I cannot add a routine to Today's tray",
          items: [
            "The focus window may already have ended. Change start and wrap-up on Today, then add it again.",
            "You cannot set a time that has already passed.",
          ],
        },
        {
          type: "issue",
          title: "Notifications are not working",
          items: [
            "iPhone Settings → Notifications → POKIT → Allow Notifications",
            "Check that POKIT is not in Focus, Do Not Disturb, or Scheduled Summary",
            "In the app, check Settings → Notifications and the day-start / look-back alerts on Start & wrap-up",
            "The unfinished alert is scheduled only if something is still open at that time.",
          ],
        },
        {
          type: "issue",
          title: "The lock-screen memo is not on the lock screen",
          items: [
            "Open Lock-screen memo at the top of Today and confirm you saved the text.",
            "Restart the iPhone, or force-quit the app and open it again.",
            "Lock-screen display can be limited by the device or iOS version.",
          ],
        },
        {
          type: "issue",
          title: "I cannot add a photo to a note",
          items: [
            "The first time you add a photo, you need to allow photo access.",
            "In iPhone Settings → POKIT → Photos, check that access is allowed.",
          ],
        },
        {
          type: "issue",
          title: "The widget is not updating",
          items: [
            "Press and hold the widget on the Home Screen to check the stack or size, then open the app once.",
            "Remove the widget and add it again.",
          ],
        },
      ],
    },
    {
      id: "contact",
      title: "Contact",
      blocks: [
        {
          type: "p",
          text: "If something goes wrong or you have an idea, email us below. In the app, Settings → Contact us fills in the device, OS, and app version for you.",
        },
      ],
    },
  ],
};
