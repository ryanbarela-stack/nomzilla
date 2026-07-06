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
            advances through stages (Recruit → Trainee → Champion) based on your current training streak,
            the same way your kaiju grows from a food-logging streak. Champion art is coming soon — for now
            it's shown as a placeholder.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Attributes</h3>
          <p className="text-sm text-gray-300">
            Each training entry is tagged to one attribute: weight training grows{" "}
            <strong className="text-red-400">Strength</strong>, cardio grows{" "}
            <strong className="text-green-400">Stamina</strong>, reading/learning grows{" "}
            <strong className="text-blue-400">Intelligence</strong>, and self-care grows{" "}
            <strong className="text-yellow-400">Wisdom</strong>. Each attribute levels up through 5 tiers —
            Untrained, Novice (5 days), Trained (15), Veteran (30), and Master (60) — based on how many
            lifetime days you've logged that attribute.
          </p>
        </section>

        <section className="flex flex-col gap-1">
          <h3 className="text-sm font-semibold text-emerald-400">Titles</h3>
          <p className="text-sm text-gray-300">
            Once any attribute passes Untrained, your champion earns a title shown under its name — like
            "Novice Strength" or "Master Wisdom" — drawn from whichever attribute you've trained the most.
          </p>
        </section>
      </div>
    </div>
  );
}
