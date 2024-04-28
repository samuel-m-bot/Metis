const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const jsforce = require('jsforce');
const crypto = require('crypto');

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if(!email || !password){
        return res.status(400).json({ message: 'All fields are required'})
    }

    const foundUser = await User.findOne({ email }).exec()

    if(!foundUser){
        console.log("EMAIL")
        return res.status(401).json({ message: 'Unauthorized - Incorrect information'})
    }
      

    const match = await bcrypt.compare(password, foundUser.passwordHash)

    if(!match){
        console.log("PASSWORD")
        return res.status(401).json({ message: 'Unauthorized - Incorrect information'})
    }

    console.log(foundUser.email)
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "email": foundUser.email,
                "firstName": foundUser.firstName,
                "surname": foundUser.surname,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h'}
    )

    const refreshToken = jwt.sign(
        {"id": foundUser._id, "email": foundUser.email},
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '5d'}
    )

    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.json({ accessToken })
})

const refresh = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized'})

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async (err, decoded) => {
            if(err) return res.status(403).json({ message: 'Forbidden'})

            const foundUser = await User.findOne({ email: decoded.email})

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized'})

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "id": foundUser._id,
                        "email": foundUser.email,
                        "firstName": foundUser.firstName,
                        "surname": foundUser.surname,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )

            res.json({ accessToken })
        })
    )
})

const logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204)
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true})
    res.json({ message: 'Cookie cleared' })
})

const redirectToSalesforce = (req, res) => {
    const conn = new jsforce.Connection({
        oauth2: {
            clientId: process.env.SALESFORCE_CLIENT_ID,
            clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
            redirectUri: 'http://localhost:3500/auth/callback',
            authorizeUrl: 'https://login.salesforce.com/services/oauth2/authorize'
        }
    });

    const authUrl = conn.oauth2.getAuthorizationUrl({
        response_type: 'code',
        scope: 'full'
    });

    console.log("Redirecting to Salesforce:", authUrl);
    res.redirect(authUrl);
};

const handleSalesforceCallback = async (req, res) => {
    const { code } = req.query;
    const conn = new jsforce.Connection({
        oauth2: {
            clientId: process.env.SALESFORCE_CLIENT_ID,
            clientSecret: process.env.SALESFORCE_CLIENT_SECRET,
            redirectUri: 'http://localhost:3500/auth/callback'
        }
    });

    try {
        await conn.authorize(code);
        console.log('Access Token:', conn.accessToken);
        req.session.accessToken = conn.accessToken;
        req.session.refreshToken = conn.refreshToken;
        res.redirect('http://localhost:3000/home');
    } catch (error) {
        console.error('Salesforce authorization error:', error);
        res.status(500).send('Authentication error');
    }
};

const checkAccessToken = asyncHandler(async (req, res) => {
    if (req.session.accessToken) {
        return res.status(200).json({
            message: 'Access Token is present',
            accessToken: req.session.accessToken  
        });
    } else {
        return res.status(404).json({
            message: 'No Access Token found'
        });
    }
});


module.exports = {
    login,
    refresh,
    logout,
    redirectToSalesforce,
    handleSalesforceCallback,
    checkAccessToken
}