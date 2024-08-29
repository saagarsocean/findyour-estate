const listingValidationSchema = {
    name: {
        exists: {
            errorMessage: 'Name is required'
        },
        notEmpty: {
            errorMessage: 'Name cannot be empty'
        },
        trim: true
    },
    description: {
        exists: {
            errorMessage: 'Description is required'
        },
        notEmpty: {
            errorMessage: 'Description cannot be empty'
        },
        trim: true
    },
    address: {
        exists: {
            errorMessage: 'Address is required'
        },
        notEmpty: {
            errorMessage: 'Address cannot be empty'
        },
        trim: true
    },
    regularPrice: {
        exists: {
            errorMessage: 'Regular price is required'
        },
        notEmpty: {
            errorMessage: 'Regular price cannot be empty'
        },
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Regular price must be a positive number'
        }
    },
    discountPrice: {
        exists: {
            errorMessage: 'Discount price is required'
        },
        notEmpty: {
            errorMessage: 'Discount price cannot be empty'
        },
        isFloat: {
            options: { min: 0 },
            errorMessage: 'Discount price must be a positive number'
        }
    },
    bathrooms: {
        exists: {
            errorMessage: 'Number of bathrooms is required'
        },
        notEmpty: {
            errorMessage: 'Number of bathrooms cannot be empty'
        },
        isInt: {
            options: { min: 0 },
            errorMessage: 'Number of bathrooms must be a positive integer'
        }
    },
    bedrooms: {
        exists: {
            errorMessage: 'Number of bedrooms is required'
        },
        notEmpty: {
            errorMessage: 'Number of bedrooms cannot be empty'
        },
        isInt: {
            options: { min: 0 },
            errorMessage: 'Number of bedrooms must be a positive integer'
        }
    },
    furnished: {
        exists: {
            errorMessage: 'Furnished status is required'
        },
        isBoolean: {
            errorMessage: 'Furnished must be a boolean value'
        }
    },
    parking: {
        exists: {
            errorMessage: 'Parking status is required'
        },
        isBoolean: {
            errorMessage: 'Parking must be a boolean value'
        }
    },
    type: {
        exists: {
            errorMessage: 'Type is required'
        },
        notEmpty: {
            errorMessage: 'Type cannot be empty'
        },
        trim: true
    },
    offer: {
        exists: {
            errorMessage: 'Offer status is required'
        },
        isBoolean: {
            errorMessage: 'Offer must be a boolean value'
        }
    },
    imageUrls: {
        exists: {
            errorMessage: 'Image URLs are required'
        },
        isArray: {
            errorMessage: 'Image URLs must be an array'
        }
    },
    userRef: {
        exists: {
            errorMessage: 'User reference is required'
        },
        notEmpty: {
            errorMessage: 'User reference cannot be empty'
        },
        trim: true
    }
}

export default listingValidationSchema