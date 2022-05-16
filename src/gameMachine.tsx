import { assign, createMachine } from "xstate";

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
};

const emojis = [
  { type: 1, content: "😀", collected: false, flip: true },
  { type: 2, content: "😂", collected: false, flip: true },
  { type: 3, content: "😍", collected: false, flip: true },
  { type: 4, content: "😭", collected: false, flip: true },
  { type: 5, content: "😱", collected: false, flip: true },
  { type: 6, content: "😎", collected: false, flip: true },
  { type: 7, content: "😈", collected: false, flip: false },
  { type: 8, content: "😏", collected: false, flip: false },
];
const shuffleCards: GameCard[] = [...emojis, ...emojis].sort(
  () => Math.random() - 0.5
);

const initialContext = {
  cards: shuffleCards,
  pairs: [],
  firstSelected: undefined,
  secondSelected: undefined,
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
          type: "final",
        },
      },
    },
    {
      actions: {
        compareSelections: assign((context) => {
          const { firstSelected, secondSelected } = context;
          if (firstSelected!.type === secondSelected!.type) {
            context.pairs.push(firstSelected!, secondSelected!);
            firstSelected!.collected = true;
            secondSelected!.collected = true;
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
