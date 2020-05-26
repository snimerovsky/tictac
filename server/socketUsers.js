const users = [];

const addUser = ({ id, name, coins, token, isByName }) => {
  name = name.trim().toLowerCase();
  let cross = true;
  let active = true;
  let room = {};

  const existingUser = users.find((user) => user.name === name);

  if (!existingUser) {
    coins = parseInt(coins);
    const user = { id, name, coins, cross, active, token, isByName, room };

    users.push(user);

    return { user };
  }
  return existingUser;
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (name) => users.find((user) => user.name === name);

const getUserById = (id) => users.find((user) => user.id === id);

const getRandomPlayer = (name) => {
  const players = users.filter(
    (user) =>
      user.name !== name && user.active === true && user.isByName === false,
  );
  let player = players[Math.floor(Math.random() * players.length)];
  return player;
};

const getNamePlayer = (name, userName) => {
  let player = users.filter(
    (user) =>
      user.name !== name && user.name === userName && user.isByName === true,
  );
  return player[0];
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getRandomPlayer,
  getNamePlayer,
  getUserById,
};
