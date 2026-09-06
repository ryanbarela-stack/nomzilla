# Nomzilla

A calorie and macro tracker with a kaiju theme: log your food each day, and
your kaiju grows and evolves the better you stick to your goals.

## How it works

- Set daily calorie, protein, carb, and fat goals.
- Log meals throughout the day; the dashboard shows live progress toward
  each goal.
- Each day is scored on how close you landed to your targets (calories and
  protein matter most). A good score grows your kaiju's XP and extends your
  streak; a rough day slows growth or costs a little ground.
- Your kaiju evolves through six stages as XP accumulates: Egg → Hatchling
  → Juvenile → Adult → Titan → Kaiju God.

All data is stored locally in your browser (`localStorage`) — no backend or
account required.

## Development

```bash
npm install
npm run dev      # start the dev server
npm run build    # type-check + production build
npm run lint      # oxlint
```
