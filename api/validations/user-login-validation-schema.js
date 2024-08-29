const userLoginValidationSchema = {
    email: {
        exists: {
            errorMessage: 'Email is required'
        },
        notEmpty: {
            errorMessage: 'Email cannot be empty'
        },
        isEmail: {
            errorMessage: 'Invalid email address'
        }
    },
    password: {
        exists: {
            errorMessage: 'Password is required'
        },
        notEmpty: {
            errorMessage: 'Password cannot be empty'
        }
    }
}

export default userLoginValidationSchema