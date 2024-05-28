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
        fullName: profileDB.firstName + " " + profileDB.lastName + (profileDB.secondLastName ? (" " + profileDB.secondLastName) : ""), 
      },
      gender: profileDB.gender,
      birthDate: profileDB.birthDate,
      ...(profileDB.firstNationality && {
        firstNationality: {
          code: profileDB.firstNationality.code,
          description: profileDB.firstNationality.description,
          country: profileDB.firstNationality.country
        }
      })
    },   
    contactPoint: {
      ...(profileDB.postalAddress && {
        postalAddress: {
          addressLines: (profileDB.postalAddress.addressLine1 && !profileDB.postalAddress.addressLine2) 
            ? [profileDB.postalAddress.addressLine1] 
            : [],
          city: profileDB.postalAddress.city,
          zipCode: profileDB.postalAddress.zipCode,
          country: {
            code: profileDB.postalAddress.country.code,
            description: profileDB.postalAddress.country.description
          }
        }
      }),
      electronicAddress: {
        emailAddress: userDB.email
      }
    }
  };
};

module.exports = { userResponseDTO };
