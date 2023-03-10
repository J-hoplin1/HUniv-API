const UserEmailAlreadyExist = require('./UserEmailAlreadyExist');
const UserNicknameAlreadyExist = require('./UserNicknameAlreadyExist');
const UserRegisterFailed = require('./UserRegisterFailed');
const PasswordUnmatched = require('./PasswordUnmatched');
const UserNotFound = require('./Usernotfound');
const UnregisteredUser = require('./UnregisteredUser');

module.exports = {
    ...UserEmailAlreadyExist,
    ...UserNicknameAlreadyExist,
    ...UserRegisterFailed,
    ...PasswordUnmatched,
    ...UserNotFound,
    ...UnregisteredUser,
};
