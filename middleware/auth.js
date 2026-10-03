const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    try{
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "Authorization header missing" });
        }
    
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.user = decoded;
        next();
    }
    catch(error){
        console.log(error);
        res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
}

module.exports = authenticate;