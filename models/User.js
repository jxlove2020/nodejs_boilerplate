const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50
  },
  email: {
    type: String,
    trim: true,
    unique: 1
  },
  password: {
    type: String,
    minlength: 5
  },
  lastname: {
    type: String,
    maxlength: 50
  },
  role: {
    type: Number,
    default: 0
  },
  image: String,
  token: {
    type: String  
  },
  tokenExp: {
    type: Number
  }
})

// 저장하기 전에 
userSchema.pre('save', function( next ) {
  var user = this

  // 비밀번호가 변경될 때 만 암호화 // 이름을 바꿀 때도 암호화 되면 낭비
  if (user.isModified('password')) {
    // 비밀번호를 암호화 
    bcrypt.genSalt(saltRounds, function(err, salt){
      if(err) return next(err)
      
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err)

        // 해시된 비밀번호로 변경
        user.password = hash
        next()
      })
    })
  }
  
})

const User = mongoose.model('User', userSchema)

module.exports = { User }