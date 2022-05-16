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
  { type: 1, content: "😀", collected: false, flip: false },
  { type: 2, content: "😂", collected: false, flip: false },
  { type: 3, content: "😍", collected: false, flip: false },
  { type: 4, content: "😭", collected: false, flip: false },
  { type: 5, content: "😱", collected: false, flip: false },
  { type: 6, content: "😎", collected: false, flip: false },
  { type: 7, content: "😈", collected: false, flip: false },
  { type: 8, content: "😏", collected: false, flip: false },
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
            firstSelected!.collected = true;
            secondSelected!.collected = true;
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
