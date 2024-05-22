const userResponseDTO = (userDB, profileDB) => {
  return {
    userId: userDB._id,
    typeCode: profileDB.role.code,
    typeDescription: profileDB.role.description,
    person: {
      personName: {
        firstName: profileDB.firstName,
        lastName: profileDB.lastName,
        secondLastName: profileDB.secondLastName,
        fullName: profileDB.firstName + " " + profileDB.lastName + (!!profileDB.secondLastName ? (" " + profileDB.secondLastName) : ""), 
      },
      gender: profileDB.gender,
      birthDate: profileDB.birthDate,
      ...(!!profileDB.firstNationality && {
        firstNationality: {
          code: profileDB.firstNationality.code,
          description: profileDB.firstNationality.description,
          country: profileDB.firstNationality.country
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
