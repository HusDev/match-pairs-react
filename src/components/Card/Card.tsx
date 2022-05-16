import { CardStyle, CardWrapper } from "./Card.styled";
import { useSpring } from "react-spring";
import { GameCard } from "../../gameMachine";
import Logo from "./../../assets/img/logo.png";
import { memo } from "react";

interface CardProps {
  emoji: GameCard;
  selectCard: (card: GameCard) => void;
}

const Card = ({ emoji, selectCard }: CardProps) => {
  const { transform, opacity } = useSpring({
    opacity: emoji.flip ? 1 : 0,
    transform: `perspective(600px) rotateY(${emoji.flip ? 180 : 0}deg)`,
    config: { mass: 5, tension: 500, friction: 80 },
  });

  return (
    <CardWrapper
      onClick={() => {
        if (!emoji.collected) {
          selectCard(emoji);
        }
      }}
    >
      <CardStyle
        face={"front"}
        style={{ opacity: opacity.to((o) => 1 - o), transform }}
      >
        <img src={Logo} width="100%" alt={"emoji"} />
      </CardStyle>
      <CardStyle
        face={"back"}
        style={{
          opacity,
          transform,
          rotateY: "180deg",
        }}
      >
        {emoji.content}
      </CardStyle>
    </CardWrapper>
  );
};

export default memo(Card);
