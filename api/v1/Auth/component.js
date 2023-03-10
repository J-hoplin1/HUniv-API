const { v4 } = require('uuid');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const redis = require('../../../redis');
const { User } = require('../../../models');
const {
    UserEmailAlreadyExist,
    UserNicknameAlreadyExist,
    UserRegisterFailed,
    PasswordUnmatched,
    UnregisteredUser,
    UserNotFound,
} = require('../../../Exceptions').api.v1.AuthException;
const { APIKey } = require('../../../mongo/schema');

exports.authCheckEmail = async (req) => {
    const {
        email,
    } = req.body;
    const result = await User.findOne({
        attributes: ['email'],
        where: {
            email,
        },
    });
    if (result) {
        throw new UserEmailAlreadyExist(email);
    }
    return result;
};

exports.authCheckNickname = async (req) => {
    const {
        nickname,
    } = req.body;
    const result = await User.findOne({
        attributes: ['nickname'],
        where: {
            nickname,
        },
    });
    if (result) {
        throw new UserNicknameAlreadyExist(nickname);
    }
    return result;
};

exports.authJoin = async (req) => {
    /**
     * nickname, email should be unique
     */
    const {
        nickname,
        role,
        email,
        password,
    } = req.body;
    const searchUserEmail = await User.findOne({
        where: {
            [Op.or]: [
                {
                    nickname,
                },
                {
                    email,
                },
            ],
        },
    });
    if (searchUserEmail) {
        throw new UserRegisterFailed();
    }
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.PW_ENCRYPT_CYCLE, 10));
    const id = v4();
    await User.create({
        id,
        nickname,
        email,
        role,
        password: hashedPassword,
    });
    return id;
};

exports.authLogin = async (req) => {
    const {
        nickname,
        password,
    } = req.body;
    const user = await User.findOne({
        where: {
            nickname,
        },
    });
    if (!user) {
        throw new UnregisteredUser(nickname);
    }
    // Compare password
    if (!await bcrypt.compare(password, user.password)) {
        throw new PasswordUnmatched();
    }
    return user.id;
};

exports.logout = async (req) => {
    const {
        id,
    } = req.decoded;
    // delete refresh token
    await redis.del(id);
    return true;
};

exports.authWithdraw = async (req) => {
    const {
        id,
    } = req.decoded;
    const {
        password,
    } = req.body;
    const user = await User.findOne({
        where: {
            id,
        },
    });
    if (!user) {
        throw new UserNotFound(id);
    }
    if (!await bcrypt.compare(password, user.password)) {
        throw new PasswordUnmatched();
    }
    // destroy user data
    await User.destroy({
        where: {
            id,
        },
    });
    // Delete user's api key
    if (await APIKey.findOne({ userid: id })) {
        await APIKey.deleteOne({ userid: id });
    }
    // destroy refresh token of user
    await redis.del(id);
    return true;
};
