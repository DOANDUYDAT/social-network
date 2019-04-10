const User = require('../models/user');

// route middleware to make sure a user is logged in
module.exports.isLoggedIn = (req, res, next) => {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
// lấy thông tin của userAccount tương ứng 
module.exports.getInformationOfUserAccount = (req, res, next) => {
    let acc = req.params.userAccount;
    console.log(req.params);
    User.findOne({ account: acc }, (err, user) => {
        if(err) throw err;
        if(user) {
            req.acc = user;
            next();
            
        } else {
            res.render('pages/404');
        }
        
    });
    
}