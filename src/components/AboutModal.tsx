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
          <h3 className="text-sm font-semibold text-emerald-400">Logging & streaks</h3>
          <p className="text-sm text-gray-300">
            Log your food each day to build a streak. A streak stays alive as long as you don't skip a day —
            today doesn't need to be logged yet to keep it going, but missing any other day breaks it back to 0.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Growing your kaiju</h3>
          <p className="text-sm text-gray-300">
            Your kaiju grows through 3 stages based on your current streak:
          </p>
          <ul className="text-sm text-gray-300 list-disc list-inside">
            <li><strong>Egg</strong> — streak of 0+ days</li>
            <li><strong>Baby</strong> — streak of 7+ days</li>
            <li><strong>Final Form</strong> — streak of 30+ days</li>
          </ul>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Choosing your path</h3>
          <p className="text-sm text-gray-300">
            Once your kaiju reaches Baby stage, pick one of 4 species — Titan, Emperor, Quetzacoatl, or
            Mothman — to see it evolve. You can switch your path anytime after that.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Frame borders</h3>
          <p className="text-sm text-gray-300">
            Every lifetime day you log (not just your current streak) counts toward unlocking new frame
            borders around your kaiju: Bronze (5 days), Silver (15), Gold (30), Emerald (60), and Legendary
            (100). Pick your favorite unlocked frame anytime.
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
            <strong className="text-yellow-400">Wisdom</strong>. Each attribute has its own level, gaining
            one level for every 5 lifetime days you've logged that attribute — uncapped, so it keeps
            climbing the longer you train.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Titles</h3>
          <p className="text-sm text-gray-300">
            Once any attribute reaches Level 1, your champion earns a title shown under its name — like
            "Level 3 Strength" or "Level 8 Wisdom" — drawn from whichever attribute you've trained the most.
          </p>
        </section>
      </div>
    </div>
  );
}
