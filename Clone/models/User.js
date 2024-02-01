const mongo = require('mongoose')
const bcrypt = require('bcrypt')
const { isEmail } = require('validator')

const userSchema = new mongo.Schema({
  email : {
    type: String,
    required : [true,'Please enter an email'],
    validate : [isEmail, 'Please enter a valid email'],
    lowercase : true,
    unique : true
  },
  password : {
    type : String,
    required : [true,'Please enter a password'],
    minlength : [6, 'The minimum length is 6']
  }
})

// Hashing a password before the user is saved

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// A function that fires after a a doc is saved

userSchema.post('save', function(doc, next) {
  console.log(`User created & saved!`)
  next()
})

// for login

userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({email})
  
  if (user) {
    const auth = await bcrypt.compare(password, user.password)
    if (auth) {
      return user
    } else {
      throw Error('Incorrect password')
    }
  } else {
    throw Error('Incorrect email')
  }
}

const user = mongo.model("User", userSchema)
module.exports = user