const userResponseDTO = (userDB) => {
  return {
    userId: userDB._id
  };
};

module.exports = { userResponseDTO };
