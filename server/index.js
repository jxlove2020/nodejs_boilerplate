const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { User } = require('./models/User');

const config = require('./config/key');

// application/x-www-form-urlencoded 를 분석해서 가져올수 있게
app.use(bodyParser.urlencoded({ extended: true }));

// application/json 을 분석해서 가져올수 있게
app.use(bodyParser.json());

app.use(cookieParser());

// 몽고디비 연결
const mongoose = require('mongoose');
// config.mongoURI 로 데이터베이스 연결
mongoose
  .connect(config.mongoURI, {
    // 에러나지 않도록 써줍니다.
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err));

// 라우트 생성
app.get('/', (req, res) => res.send('Hello World!'));

app.get('/api/hello', (req, res) => res.send('안녕하세요'));

app.post('/api/users/register', (req, res) => {
  // 회원가입할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어 준다.
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post('/api/users/login', (req, res) => {
  // 요청된 이메일을 데이터베이스 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: '제공된 이메일에 해당하는 유저가 없습니다.',
      });
    }
    // 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch) {
        return res.json({
          loginSuccess: false,
          message: '비밀번호가 틀렸습니다.',
        });
      }
      // 비밀번호까지 맞다면 토큰을 생성.
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        // 토큰을 저장한다. 쿠키에 저장
        res
          .cookie('x_auth', user.token)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// 미들웨어 auth : const { auth } = require('./middleware/auth');
app.get('/api/users/auth', auth, (req, res) => {
  // 여기까지 왔으면 미들웨어 auth를 통과했다는 얘기
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
