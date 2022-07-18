import { css } from '@emotion/react';

export const postForm = css`
  width: 30vw;
`;

export const topbar = css`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const input = css`
  width: 100%;
  border: none;
  background-color: transparent;
  resize: none;
  padding: 1em;
`;

export const inputArea = css`
  height: 14.5em;
`;
export const button = css`
  border: none;
  border-radius: 8px;
  background-color: transparent;
  padding: 0.8em;
  font-size: large;

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  &.active {
    color: white;
    background-color: black;
  }
`;

export const icon = css`
  width: 48px;
  aspect-ratio: 1;
`;

export const textCount = css`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const textCounts = css`
  display: flex;
  justify-content: space-between; ;
`;

export const textCountLimit = css`
  display: flex;
  justify-content: space-between;
  width: 2.75rem;
`;

export const countParLimit = css`
  display: flex;
  justify-content: space-between;
  padding-left: 1em;
  width: 5rem;
`;
