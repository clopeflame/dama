const rooms = {};

function createRoom(id) {
  rooms[id] = { id, players: {}, timer: null, board: null, ready: {}, started: false, turn: "white" };
  return rooms[id];
}

function joinRoom(roomId, socketId, name) {
  const room = rooms[roomId];
  const color = Object.keys(room.players).length === 0 ? "white" : "black";
  room.players[socketId] = { id: socketId, name, color };
  return room.players[socketId];
}

function leaveRoom(roomId, socketId) {
  const room = rooms[roomId];
  if (!room) return;
  delete room.players[socketId];
  if (Object.keys(room.players).length === 0) delete rooms[roomId];
}

function getRoom(roomId) {
  return rooms[roomId];
}

module.exports = { createRoom, joinRoom, leaveRoom, getRoom };
