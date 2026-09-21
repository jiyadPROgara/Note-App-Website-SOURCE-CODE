
function ValidateCredentials(username, password){
    if(
        typeof username !== 'string' ||
        typeof password !== 'string'
    ){
        return {
            error: "Invalid credentials"
        };
    };
    if (username.length === 0 || password.length === 0) {
        return {
            error: "Username and password are required"
        };
    };
    return {
        ok
    };
};

function loginChecker(req, res, next){
    if(!req.session || !req.session.userId){
        return res.status(401).json({
            error: "Not logged in"
        });
    };
    next();
};



module.exports = {
    ValidateCredentials,
    loginChecker
};