module.exports = ( req, res, next) =>{
    const apikey = req.headers['x-api-key'];
    if(!apikey || apikey !==process.env.MOBILE_API_KEY){
        return res.status(403).json({ message: 'Invalid or missing API KEY'});
    }
    next();
};