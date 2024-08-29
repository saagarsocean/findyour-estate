import Listing from '../models/listing-model.js';
import { sendVerificationEmail } from '../utils/mail.js';
import User from '../models/user-model.js';

export const verifyListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        console.log('Verifying Listing:', listingId)

        // Check if the listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ error: 'Listing not found' });
        }

        // Check if the user is an admin
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'You are not authorized to perform this action' });
        }

        const user = await User.findById(listing.userRef)
        if(!user) {
            return res.status(404).json({error: 'User not found'})
        }

        // Update the listing's isVerified field
        listing.isVerified = true;
        await listing.save();

        await sendVerificationEmail(user.email, listing.name)

        res.status(200).json({ message: 'Listing verified successfully', listing });
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

export const getUnverifiedListings = async (req, res) => {
    try {
        // Only admin users should access this route
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Access denied' });
        }

        // Fetch unverified listings
        const unverifiedListings = await Listing.find({ isVerified: false });
        res.status(200).json(unverifiedListings);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong!' });
    }
}
