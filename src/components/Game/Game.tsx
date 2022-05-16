import { Card } from "../Card/Card";
import { Wrapper } from "./Game.styled";
import { createMemoryGameMachine, GameCard } from "./../../gameMachine";
import { useMachine } from "@xstate/react";

const gameMachine = createMemoryGameMachine();

const Game = () => {
  const [state, send] = useMachine(gameMachine);

  const selectCard = (card: GameCard) => {
    const index = state.context.cards.indexOf(card);
    send("SELECT", { index });
  };

  const cards = state.context.cards;

  console.log(state.context);

  return (
    <>
      <Wrapper>
        {cards.map((emoji, index) => {
          return <Card key={index} emoji={emoji} selectCard={selectCard} />;
        })}
      </Wrapper>
    </>
  );
};

export default Game;
