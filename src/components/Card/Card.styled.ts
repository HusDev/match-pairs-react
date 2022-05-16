import styled from "styled-components";
import { a } from "react-spring";

interface CardProps {
  face: "front" | "back";
  style: any;
}

const CardWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CardStyle = styled(a.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${(props: CardProps) =>
    props.face === "front"
      ? "var(--color-gray-light)"
      : "var(--color-gray-light)"};
  font-size: 4rem;
  width: 100px;
  height: 100px;
  border-radius: 4px;
  padding: 10px;
  cursor: pointer;
  position: absolute;
  will-change: transform, opacity;
`;

export { CardStyle, CardWrapper };
