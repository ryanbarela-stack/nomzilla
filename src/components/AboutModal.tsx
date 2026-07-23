interface Props {
  onClose: () => void;
}

export function AboutModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 max-w-lg w-full max-h-[85vh] flex flex-col gap-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-pixel font-bold text-[#e6edf3]">How Nomzilla works</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-200 px-2 text-lg leading-none">
            ✕
          </button>
        </div>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Streaks</h3>
          <p className="text-sm text-gray-300">
            Log food each day to build a streak, shown as the 🔥 bar under your champion. A streak stays
            alive as long as you don't skip a day — today doesn't need to be logged yet to keep it going,
            but missing any other day breaks it back to 0. Every 7 days is a milestone, and streak days
            are marked with 🔥 on the calendar.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Logging food & protein</h3>
          <p className="text-sm text-gray-300">
            Log each food's name and calories against your daily calorie target — click the target number
            to change it. Protein has its own target and progress bar nested right under calories, so you
            can track it separately from your calorie budget. Type a description like "2 eggs and a banana"
            and hit{" "}
            <strong className="text-emerald-400">Estimate</strong> to auto-fill calories and protein from a
            small built-in food table — always double-check the numbers before adding, since it's a rough
            estimate, not an exact lookup. Add a free USDA FoodData Central API key (under the "Improve
            estimates" link on the form) to also look up foods the built-in table doesn't recognize — the
            key is stored only on this device.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Growing your champion</h3>
          <p className="text-sm text-gray-300">
            Alongside food, log your training in the Training log: what you did, which attribute it
            trains, and — optionally — sets, reps, and either weight lifted or time spent. Your champion
            has a health bar that starts at 100% and drains 1% every hour. Logging a Strength or Stamina
            training entry restores 33% of it. Pick a class — Warrior, Barbarian, Monk, Cleric, Wizard, or
            Rogue — anytime to change how your champion looks.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Mana</h3>
          <p className="text-sm text-gray-300">
            Below the health bar are 3 mana charges. Using one pauses health decay for 24 hours — it
            doesn't get used up permanently, it just recharges and becomes usable again 24 hours after
            you activate it.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Attributes</h3>
          <p className="text-sm text-gray-300">
            Each training entry is tagged to one attribute: weight training grows{" "}
            <strong className="text-red-400">Strength</strong>, cardio grows{" "}
            <strong className="text-green-400">Stamina</strong>, reading/learning grows{" "}
            <strong className="text-blue-400">Intelligence</strong>, and self-care grows{" "}
            <strong className="text-yellow-400">Wisdom</strong>. Every attribute levels up uncapped, but
            they earn progress differently:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside">
            <li>
              <strong className="text-red-400">Strength</strong> and{" "}
              <strong className="text-green-400">Stamina</strong> earn XP from what you actually log — more
              reps, heavier weight, or longer time all earn more XP — 5,000 XP per level.
            </li>
            <li>
              <strong className="text-blue-400">Intelligence</strong> and{" "}
              <strong className="text-yellow-400">Wisdom</strong> level up from consistency — one point per
              lifetime day logged, 5 days per level.
            </li>
          </ul>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Progressive overload</h3>
          <p className="text-sm text-gray-300">
            When you log an exercise you've logged before (same description), the Training log shows your
            last result and a suggested nudge up — a bit more weight or time, same reps — so it's easy to
            keep progressing instead of repeating the same numbers.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Titles</h3>
          <p className="text-sm text-gray-300">
            Once any attribute reaches Level 1, your champion earns a fantasy title shown under its
            name — like "Level 3 Bruiser" (Strength) or "Level 8 Archmage" (Intelligence) — drawn from
            whichever attribute you've trained the most. Each attribute has its own run of titles that
            gets grander as you level up. Click the title to pin it to a specific attribute instead of
            always showing the highest one.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Calendar</h3>
          <p className="text-sm text-gray-300">
            Each day is colored green if you logged food and stayed under your calorie target, red if you
            went over, and dark if nothing was logged. A small dot marks days you also logged training.
            Click any day to view or edit that day's log.
          </p>
        </section>
      </div>
    </div>
  );
}
