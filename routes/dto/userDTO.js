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
      ...(!!profileDB.postalAddress && {
        postalAddress: {
          addressLines: [
            profileDB.postalAddress.addressLine1,
            ...(!!profileDB.postalAddress.addressLine2 && { profileDB.postalAddress.addressLine2 })
          ]
        }
      }),
      electronicAddress: {
        emailAddress: userDB.email
      }
    }
  };
};

module.exports = { userResponseDTO };
