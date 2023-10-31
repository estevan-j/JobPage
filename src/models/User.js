const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name must be provided please'],
        minLength: 3,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, 'Name must be provided please'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minLength: 6,
    },
    

})

//Middleware mongosse => Encripte password
UserSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next();// devuelve el control al controller => register
})

//Middleware mongoose to create a JWT Authentication
UserSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id, name: this.name }, 'jwtSecret', {expiresIn: '30d'})
}

module.exports = mongoose.model('User', UserSchema);