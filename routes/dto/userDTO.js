const userResponseDTO = (userDB, profileDB) => {
  return {
    userId: userDB._id,
    typeCode: profileDB.role.code,
    typeDescription: profileDB.role.description,
    person: {
      personName: {
        firstName: userDB.profile.firstName,
        lastName: userDB.profile.lastName,
        secondLastName: userDB.profile.secondLastName,
        fullName: userDB.profile.firstName + " " + userDB.profile.lastName + 
          (!!userDB.profile.secondLastName ? (" " + userDB.profile.secondLastName) : ""), 
      },
      gender: userDB.profile.gender,
      birthDate: userDB.profile.birthDate,
      ...(!!userDB.profile.nationality && {
        firstNationality: {
          code: userDB.profile.nationality.code,
          description: userDB.profile.nationality.description
        }
      })
    },   
    contactPoint: {
      electronicAddress: {
        emailAddress: userDB.email
      }
    },
    audit: {
      creationDate: userDB.createdAt,
      modificationDate: userDB.updatedAt
    }
  };
};

module.exports = { userResponseDTO };
