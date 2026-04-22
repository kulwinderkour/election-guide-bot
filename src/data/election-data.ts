export type Phase = {
  id: number;
  title: string;
  short: string;
  duration: string;
  weeksOffset: number; // weeks before/after poll day
  details: string;
  icon: string;
};

export const PHASES: Phase[] = [
  { id: 1, title: "Schedule Announcement", short: "ECI announces poll dates", duration: "6–8 weeks before", weeksOffset: -8, icon: "📢",
    details: "The Election Commission of India holds a press conference declaring poll dates, model code of conduct kicks in immediately." },
  { id: 2, title: "Notification Issued", short: "Official gazette notification", duration: "5–6 weeks before", weeksOffset: -6, icon: "📰",
    details: "Returning Officer issues notification calling upon constituency to elect a representative." },
  { id: 3, title: "Nominations Filed", short: "Candidates submit papers", duration: "1 week", weeksOffset: -5, icon: "📝",
    details: "Candidates file nomination papers with deposits and affidavits declaring assets, criminal records." },
  { id: 4, title: "Scrutiny", short: "Validation of nominations", duration: "1 day", weeksOffset: -4, icon: "🔍",
    details: "Returning Officer scrutinises papers; defective nominations rejected." },
  { id: 5, title: "Withdrawal Window", short: "Last chance to pull out", duration: "2 days", weeksOffset: -4, icon: "↩️",
    details: "Candidates may withdraw; final list of contestants is published with allotted symbols." },
  { id: 6, title: "Campaigning", short: "Rallies, manifestos, debates", duration: "2–3 weeks", weeksOffset: -3, icon: "📣",
    details: "Public rallies, door-to-door, social media. Spending caps enforced by ECI observers." },
  { id: 7, title: "Silence Period", short: "48-hour campaign blackout", duration: "48 hours", weeksOffset: 0, icon: "🤫",
    details: "All public campaigning ceases 48 hours before polling. No media ads, no rallies." },
  { id: 8, title: "Polling Day(s)", short: "Phased voting across India", duration: "4–5 weeks (phased)", weeksOffset: 0, icon: "🗳️",
    details: "EVMs + VVPATs used. Polling 7 AM–6 PM. Indelible ink marks the finger." },
  { id: 9, title: "Counting", short: "Votes counted centrally", duration: "1 day", weeksOffset: 1, icon: "🔢",
    details: "EVMs opened at counting centres; results trickle in by afternoon." },
  { id: 10, title: "Result Declaration", short: "Winners announced", duration: "Same day", weeksOffset: 1, icon: "🏆",
    details: "Returning Officer issues certificate of election to winning candidates." },
  { id: 11, title: "Government Formation", short: "Majority party invited", duration: "1–2 weeks", weeksOffset: 2, icon: "🏛️",
    details: "President/Governor invites majority party leader to form government." },
  { id: 12, title: "Oath & Review", short: "Swearing-in ceremony", duration: "2–3 weeks", weeksOffset: 3, icon: "🤝",
    details: "PM/CM and cabinet take oath. ECI publishes statistical report post-poll." },
];

export const QUIZ: { q: string; options: string[]; answer: number; explain: string }[] = [
  { q: "What is the minimum age to vote in Indian elections?", options: ["16", "18", "21", "25"], answer: 1,
    explain: "The 61st Constitutional Amendment (1988) reduced voting age from 21 to 18." },
  { q: "Who announces the election schedule?", options: ["President", "Prime Minister", "Election Commission of India", "Supreme Court"], answer: 2,
    explain: "ECI is an autonomous constitutional authority that conducts all elections." },
  { q: "What comes immediately after Nominations?", options: ["Polling", "Scrutiny", "Counting", "Campaigning"], answer: 1,
    explain: "Returning Officer scrutinises papers the day after nominations close." },
  { q: "How many days before polling can you typically register as a voter?", options: ["7 days", "14 days", "21 days", "60 days"], answer: 2,
    explain: "Voter rolls usually freeze ~21 days before poll day. Register at voters.eci.gov.in." },
  { q: "What is the Model Code of Conduct?", options: ["A dress code", "Rules for candidates & parties during elections", "Voter ID format", "Campaign budget"], answer: 1,
    explain: "MCC governs party/candidate behaviour from schedule announcement until results." },
  { q: "What machine is used to verify votes?", options: ["EVM", "VVPAT", "Both EVM & VVPAT", "Paper ballot"], answer: 2,
    explain: "EVMs record votes; VVPATs print a slip so voters can verify their choice." },
];
