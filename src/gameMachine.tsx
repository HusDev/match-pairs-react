import { assign, createMachine } from "xstate";
// Too heavy I won't use it in real world project
import emoji from "emoji.json/emoji-compact.json";

console.log(emoji[1000]);

export type GameCard = {
  type: number;
  collected: boolean;
  flip: boolean;
  content: string;
};

export type GameContext = {
  cards: GameCard[];
  pairs: GameCard[];
  firstSelected?: GameCard | undefined;
  secondSelected?: GameCard | undefined;
  totalMoves: number;
  finished: boolean;
};

const getEmoji = () => {
  console.log(Math.floor(Math.random() * 10) + 1);
  return emoji[Math.floor(Math.random() * 2000) + 1];
};

const emojis = [
  { type: 1, content: getEmoji(), collected: false, flip: false },
  { type: 2, content: getEmoji(), collected: false, flip: false },
  { type: 3, content: getEmoji(), collected: false, flip: false },
  { type: 4, content: getEmoji(), collected: false, flip: false },
  { type: 5, content: getEmoji(), collected: false, flip: false },
  { type: 6, content: getEmoji(), collected: false, flip: false },
  { type: 7, content: getEmoji(), collected: false, flip: false },
  { type: 8, content: getEmoji(), collected: false, flip: false },
];

const emojis2 = JSON.parse(JSON.stringify(emojis));

const shuffleCards: GameCard[] = [...emojis, ...emojis2].sort(
  () => Math.random() - 0.5
);

const initialContext = {
  cards: shuffleCards,
  pairs: [],
  firstSelected: undefined,
  secondSelected: undefined,
  totalMoves: 0,
  finished: false,
};

const isFinished = (c: GameContext) => c.cards.every((c) => c.collected);
const isNotFinished = (c: GameContext) => !isFinished(c);

export const createMemoryGameMachine = () =>
  createMachine<GameContext>(
    {
      id: "memory",
      initial: "idle",
      context: initialContext,
      states: {
        idle: {
          on: {
            SELECT: {
              target: "oneSelected",
              actions: ["selectFirst"],
            },
          },
        },
        oneSelected: {
          on: {
            SELECT: {
              target: "twoSelected",
              actions: ["selectSecond"],
            },
          },
        },
        twoSelected: {
          after: {
            500: "comparing",
          },
        },
        comparing: {
          entry: "compareSelections",
          on: {
            "": [
              {
                target: "finished",
                cond: isFinished,
              },
              {
                target: "idle",
                cond: isNotFinished,
              },
            ],
          },
        },
        finished: {
          entry: assign({ finished: true }),
          on: {
            RESET: "reset",
          },
        },
        reset: {
          entry: assign((context) => {
            context.cards.forEach((c) => {
              c.collected = false;
              c.flip = false;
            });
            context.pairs = [];
            context.firstSelected = undefined;
            context.secondSelected = undefined;
            context.totalMoves = 0;
            context.finished = false;
            return context;
          }),
        },
      },
    },
    {
      actions: {
        compareSelections: assign((context) => {
          context.totalMoves = context.totalMoves + 1;
          const { firstSelected, secondSelected } = context;
          if (firstSelected!.type === secondSelected!.type) {
            firstSelected!.collected = true;
            secondSelected!.collected = true;
            context.pairs.push(firstSelected!, secondSelected!);
          } else {
            firstSelected!.flip = false;
            secondSelected!.flip = false;
          }
          context.firstSelected = context.secondSelected = undefined;
          return context;
        }),
        selectFirst: assign((context, e) => {
          context.firstSelected = context.cards[e.index];
          if (!context.firstSelected?.flip) {
            context.firstSelected!.flip = true;
          }
          return context;
        }),
        selectSecond: assign((context, e) => {
          context.secondSelected = context.cards[e.index];
          if (!context.secondSelected?.flip) {
            context.secondSelected!.flip = true;
          }
          return context;
        }),
      },
    }
  );
