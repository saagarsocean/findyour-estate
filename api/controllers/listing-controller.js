import Listing from "../models/listing-model.js"

export const createListing = async(req, res) => {
    try{
        const listing = await Listing.create(req.body)
        return res.status(201).json(listing)
    } catch(error) {
        res.status(500).json({error: 'Something went wrong!'})
    }
}

export const deleteListing = async(req, res) => {
    const listing = await Listing.findById(req.params.id)
    if(!listing) {
        return res.status(404).json('Listing not found!!')
    }

    if(req.user.id !== listing.userRef) {
        return res.status(401).json('You can only delete your own listings!!')
    }

    try{
        await Listing.findByIdAndDelete(req.params.id)
        res.status(200).json('Listing has been deleted!!')
    } catch(error) {
        res.status(500).json({error: 'Something went wrong!'})
    }
}

export const updateListing = async(req, res) => {
    const listing = await Listing.findById(req.params.id)
    if(!listing) {
        return res.status(404).json('Listing not found!!')
    }

    if(req.user.id !== listing.userRef) {
        return res.status(401).json('You can only update your own listing!!')
    }

    try{
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {new: true})
        res.status(200).json(updatedListing)
    } catch(error) {
        res.status(500).json({error: 'Something went wrong!'})
    }
}

export const getListing = async(req, res) => {
    try{
        const listing = await Listing.findById(req.params.id)
        if(!listing) {
            return res.status(404).json('Listing not found!!')
        }
        res.status(200).json(listing)
    } catch(error){
        res.status(500).json({error: 'Something went wrong!'})
    }
}

export const getListings = async (req, res) => {
    try{
        const limit = parseInt(req.query.limit) || 9
        const startIndex = parseInt(req.query.startIndex) || 0

        let offer = req.query.offer
        if(offer === undefined || offer === 'false') {
            offer = { $in: [false, true] }
        }

        let furnished = req.query.furnished
        if(furnished === undefined || furnished === 'false') {
            furnished = { $in: [false, true]}
        }

        let parking = req.query.parking
        if(parking === undefined || parking === 'false') {
            parking = { $in: [false, true]}
        }

        let type = req.query.type
        if(type === undefined || type === 'all') {
            type = { $in: ['sale', 'rent']}
        }

        const searchTerm = req.query.searchTerm || ''

        const sort = req.query.sort || 'createdAt'

        const order = req.query.order || 'desc'

        const isAdmin = req.user && req.user.isAdmin
        const isVerified = req.query.isVerified === 'true'

        const listings = await Listing.find({
            $or: [
                { name: { $regex: searchTerm, $options: 'i' } }, // Search in name
                { address: { $regex: searchTerm, $options: 'i' } } // Search in address
            ],
            offer,
            furnished,
            parking,
            type,
            ...(isAdmin || isVerified ? {} : { isVerified: true })
        }).sort({ [sort]: order })
          .limit(limit)
          .skip(startIndex)

        return res.status(200).json(listings)
        

    } catch(error) {
        res.status(500).json({error: 'Something went wrong!'})
    }
}