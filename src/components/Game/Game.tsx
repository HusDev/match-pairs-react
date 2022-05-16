import Card from "../Card/Card";
import { Wrapper, Status } from "./Game.styled";
import { createMemoryGameMachine, GameCard } from "./../../gameMachine";
import { useMachine } from "@xstate/react";
import { useCallback } from "react";

const gameMachine = createMemoryGameMachine();

const Game = () => {
  const [state, send] = useMachine(gameMachine);

  const selectCard = (card: GameCard) => {
    const index = state.context.cards.indexOf(card);
    send("SELECT", { index });
  };

  const cards = useCallback(() => state.context.cards, [state.context.cards])();

  return (
    <div>
      <h1>Match and Pair Game</h1>
      <Status>
        <p>Pairs matched: {state.context.pairs.length / 2}/8</p>
        <p>Total Moves: {state.context.totalMoves}</p>
      </Status>
      <Wrapper>
        {cards.map((emoji, index) => {
          return <Card key={index} emoji={emoji} selectCard={selectCard} />;
        })}
      </Wrapper>
    </div>
  );
};

export default Game;
