const User = require("../models/user.js");

module.exports.signupPage = (req,res) => {
    // Check if user is logged in with Passport.js
    const isLoggedIn = req.isAuthenticated && req.isAuthenticated();
    if (isLoggedIn) {
        let redirectTo = '/';
        // Check the referer, avoiding the signup page
        const referer = req.get('Referer');
        if (referer && !referer.includes('/signup')) {
            redirectTo = referer;
        }
        return res.redirect(redirectTo);
    }
    
    // Only reach here if user is not logged in    
    // Use req.get('Referer') instead of parsing raw headers
    const referer = req.get('Referer');    
    // Pass referer to the signup form
    res.render("users/signup.ejs", { referer: referer });
}

module.exports.signupRequest = async (req,res) => {
    try{
        let {username, email, password} = req.body;
        username = username.toLowerCase();
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success", "SignUp successfull. Welcome to AirBNB !");
            let redirectUrl = req.body.referer || "/listings";
            res.redirect(redirectUrl);
        })
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}

module.exports.loginPage = (req,res) => {
    // Check if user is logged in with Passport.js
    const isLoggedIn = req.session && req.session.passport && req.session.passport.user;
    if (isLoggedIn) {        
        let redirectTo = '/';
        // If we have a stored redirect URL in the session, use that
        if (req.session.redirectUrl) {
            redirectTo = req.session.redirectUrl;
        } 
        // Otherwise check the referer, avoiding the login page
        else {
            const referer = req.get('Referer');
            if (referer && !referer.includes('/login')) {
                redirectTo = referer;
            }
        }
        return res.redirect(redirectTo);
    }

    // Only reach here if user is not logged in
    const referer = req.get('Referer');
    let redirectUrl = req.session.redirectUrl;
    delete req.session.redirectUrl;
    if (redirectUrl === "/listings/new") {
        res.render("users/login.ejs", { referer: redirectUrl });
    } else {
        res.render("users/login.ejs", { referer: referer });
    }
}

module.exports.loginRequest = async(req,res) => {
    req.flash("success", "Welcome Back to AirBNB");
    res.locals.currUser = req.user;

    // Get referer from form submission instead of session
    let redirectUrl = req.body.referer || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next) => {
    const refererValue = req.get('Referer');
    delete req.session.redirectUrl;
    req.logout((err) => {
        if(err){
            return next(err);
        }
        req.flash("success", "Logout successful");
        let redirectUrl = refererValue || "/listings";
        res.redirect(redirectUrl);
    })
}