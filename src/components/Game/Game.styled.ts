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

export { Wrapper, Status };
