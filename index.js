const express = require('express');
const app = express()
const port = 5000
const bodyParser = require('body-parser')
const { User } = require("./models/User")

const config = require('./config/key')

// application/x-www-form-urlencoded 를 분석해서 가져올수 있게
app.use(bodyParser.urlencoded({extended: true}))

// application/json 을 분석해서 가져올수 있게 
app.use(bodyParser.json())

// 몽고디비 연결 
const mongoose = require('mongoose')
// config.mongoURI 로 데이터베이스 연결
mongoose.connect(config.mongoURI, {
  // 에러나지 않도록 써줍니다.  
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// 라우트 생성
app.get('/', (req, res) => res.send('Hello World!'))

app.post('/register', (req, res)=>{
  // 회원가입할 때 필요한 정보들을 client에서 가져오면 
  // 그것들을 데이터 베이스에 넣어 준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err})
    return res.status(200).json({
      success: true
    })
  })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))