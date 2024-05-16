const userResponseDTO = (userDB, profileDB) => {
  return {
    userId: userDB._id
  };
};

module.exports = { userResponseDTO };
