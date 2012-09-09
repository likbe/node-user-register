var errors = {};

// REGISTER
Object.defineProperty(errors,'USER_ALREADY_EXISTS',{value:999999});
Object.defineProperty(errors,'UNABLE_TO_FIND_USER_TO_RESEND_MAIL',{value:999998});

//ACCOUNT 
Object.defineProperty(errors,'INVALID_PASSWORD_USER_DOES_NOT_EXIST',{value:999997});
Object.defineProperty(errors,'INVALID_PASSWORD_USER_IS_NOT_ACTIVE',{value:999996});
Object.defineProperty(errors,'INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH',{value:999995});

Object.defineProperty(errors,'COULD_NOT_FIND_USER_BY_EMAIL',{value:999994});
Object.defineProperty(errors,'COULD_NOT_FIND_USER_BY_ID',{value:999993});

module.exports = errors; 



