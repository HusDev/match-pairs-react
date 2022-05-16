import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(4, 1fr);
  grid-gap: 1rem;
  margin: 0 auto;
  max-width: 500px;
  width: 500px;
  padding: 1rem;
  height: 500px;
  border: 1px solid var(--color-gray-light);
  margin: 0 auto;
  border-radius: 4px;
`;

const Status = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.2rem;
`;

const Button = styled.button`
  background: var(--color-gray-light);
  border: none;
  border-radius: 4px;
  color: var(--color-white);
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  margin-top: 1rem;
  &:hover {
    background: var(--color-gray-dark);
  }
`;

export { Wrapper, Status, Button };
