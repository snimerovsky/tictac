import { START_GAME, PUSH_BLOCK, WIN_GAME, END_GAME } from "../actions/types";

const initialState = {
  room: null,
  open: false,
  winner: {
    name: "",
  },
  you: {
    coins: 0,
  },
  player: {
    coins: 0,
  },
  isGame: false,
  blocks: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case START_GAME:
      return {
        ...state,
        isGame: true,
        room: payload.data.room,
        you: payload.data.you,
        player: payload.data.player,
      };
    case END_GAME:
      return {
        ...state,
        isGame: false,
        open: false,
        blocks: [],
        winner: {
          name: "",
        },
        you: {
          coins: 0,
        },
        player: {
          coins: 0,
        },
      };
    case PUSH_BLOCK:
      return {
        ...state,
      };
    case WIN_GAME:
      return {
        ...state,
        winner: payload.winner,
        you: payload.you,
        payload: payload.payload,
        open: true,
      };
    default:
      return state;
  }
}
