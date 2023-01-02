function errorHandler(err,req,res, next){
    // jwt unauthorized error
    if(err.name === 'UnautorizedError'){
        return res.status(401).json({message: 'the user is not authorized'});
    }
    // Validation error
    if(err.name === 'ValidationError'){
        return res.status(401).json({message: err});
    }
    // default to 500 server error
    return res.status(500).json(err);
}

module.exports = errorHandler;