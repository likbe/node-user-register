var errors = {};

//REGISTER
Object.defineProperty(errors,'USER_ALREADY_EXISTS',{value:999999});
Object.defineProperty(errors,'UNABLE_TO_FIND_USER_TO_RESEND_MAIL',{value:999998});

//ACCOUNT 
Object.defineProperty(errors,'INVALID_PASSWORD_USER_DOES_NOT_EXIST',{value:999997});
Object.defineProperty(errors,'INVALID_PASSWORD_USER_IS_NOT_ACTIVE',{value:999996});
Object.defineProperty(errors,'INVALID_PASSWORD_PASSWORD_DOES_NOT_MATCH',{value:999995});

Object.defineProperty(errors,'COULD_NOT_FIND_USER_BY_EMAIL',{value:999994});
Object.defineProperty(errors,'COULD_NOT_FIND_USER_BY_ID',{value:999993});

//WORKSPACE
Object.defineProperty(errors,'COULD_NOT_SEARCH_WORKSPACE_BY_OWNER',{value:999992});
Object.defineProperty(errors,'WORKSPACE_ALREADY_EXISTS',{value:999991});

//CHANGE PASSWORD
Object.defineProperty(errors,'CHANGEPASSWORD_FAILED_DUE_TO_TECHNICAL_ERROR',{value:999990});
Object.defineProperty(errors,'CHANGE_PASSWORD_CONFIRMATION_DOES_NOT_MATCH',{value:999989});

module.exports = errors; 



