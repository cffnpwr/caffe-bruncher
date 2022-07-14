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
