import User from "../models/user-model.js"

const userRegisterValidationSchema = {
    username: {
        exists: {
            errorMessage: 'Username is required'
        },
        notEmpty: {
            errorMessage: 'Username cannot be empty'
        },
        isLength: {
            options: { min: 3 },
            errorMessage: 'Username must be at least 3 characters long'
        },
        matches: {
            options: /^[a-zA-Z0-9_]+$/,
            errorMessage: 'Username can only contain letters, numbers, and underscores'
        },
        trim: true
    },
    email: {
        exists: {
            errorMessage: 'Email is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Invalid email address'
        },
        custom: {
            options: async function(value) {
                const user = await User.findOne({ email: value })
                if (user) {
                    throw new Error('Email already taken')
                } else {
                    return true
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password: {
        exists: {
            errorMessage: 'Password is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        },
        isLength: {
            options: { min: 8, max: 128 },
            errorMessage: 'Password should be between 8 - 128 characters'
        },
        trim: true
    },
    avatar: {
        optional: true,
        isURL: {
            errorMessage: 'Invalid avatar URL'
        }
    }
}

export default userRegisterValidationSchema
