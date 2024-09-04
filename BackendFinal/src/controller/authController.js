const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_KEY = require("../config/keys.js");
const methods = require("./methods.js");
const { sendMail } = require("../utility/nodemailer");

function logOutUser(req, res) {
  res.cookie("login", " ", { maxAge: 1 });
  res.redirect("/");
}

async function postSignUp(req, res) {
  const data = req.body.cred;
  const hashed_password = await methods.encryptPassword(data.password);
  //console.log(hashed_password);
  // console.log("Hashed: ", hashed_password);
  try {
    const result = await db.query(
      `INSERT INTO Users (username, password, email, display_name, dob, private_account) values ('${
        data.username
      }', '${hashed_password}', '${data.email}', '${data.display_name}', '${
        data.dob
      }', ${"false"});`
    );

    const user_get=await methods.getUserByEmailOrUsername(data.username);
    let login_cookie = jwt.sign({ payload: user_get.id }, JWT_KEY);
    console.log(user_get);
    res
      .status(200)
      .json({ message: `${data.display_name} signed up!`, success: true,user:user_get,token:login_cookie });
  } catch (err) {
    console.log(err.message);
    res
      .status(400)
      .json({ message: "Sign Up failed!", error: err.message, success: false });
  }
}

async function postLogin(req, res) {
  try {
    //console.log(req.body);
    const user = await methods.getUserByEmailOrUsername(req.body.username);
    const user_data = await methods.getUserDataByID(user.id);
    console.log(user_data.image_url);

    if (user) {
      if (await bcrypt.compare(req.body.password, user.password)) {
        let uid = user.id;
        let login_cookie = jwt.sign({ payload: uid }, JWT_KEY);
        res.cookie("login", login_cookie);
        res.status(200).json({
          message: "Login Success!",
          success: true,
          token: login_cookie,
          user:user_data,
        });
      } else {
        res.send({
          message: "Wrong Password or Email",
          success: false,
        });
      }
    }
    else{
      res.send({
        message: "Wrong Password or Email",
        success: false,
      });
    }
  } catch (err) {
    res.status(500).json({
      message: "User not found!",
      error: err.message,
      success: false,
    });
  }
}

async function getLogin(req, res) {
  const user = await methods.getLoggedUser(req);

  if (user) {
    res.status(200).json({
      message: "Already logged in.",
      loggedIn: true,
    });
  } else {
    res.status(401).json({
      message: "Login to continue.",
      loggedIn: false,
    });
  }
}

async function sendEmail(req, res) {
  try {
    const email = req.body?.email;
    const current_mode=req.body?.mode;  // 0 for signup and 1 for forget pass

    const code = Math.floor(Math.random() * 1000000);
       console.log(req.body);
    const m_data_for_forget_password= `<h2>Connectify</h2>
                                   <h4>Password Resest</h4>
                                 <p>Your reset code is ${code}</p>`;

      const m_data_for_signup= `<h2>Connectify</h2>
                           <h4>Welcome to Account SignUp</h4>
                        <p>Your registration code is ${code}</p>`
                                 

    const emailData = {
      email: `${email}`, // receiver
      subject: "Reset Password",
      text: "",
      html: current_mode?m_data_for_forget_password:m_data_for_signup,
    };
    if (sendMail(emailData)) {
      res.json({
        code: code,
        message: " Email sent !",
        success: true,
      });
    } else {
      res.json({
        message: "Reset email not sent.",
        success: false,
      });
    }
  } catch (error) {
    res.json({
      message: "An error occured.",
      success: false,
    });
    console.log(error.message);
  }
}

const checkUserName = async (req, res) => {
  try {
    // console.log(req.body);
    const result = await db.query(
      `SELECT username from Users WHERE username='${req.body.username}';`
    );

    // console.log(result);

    if (result.rows.length != 0) {
      //console.log("request sent false");
      res.status(200).send({
        success: false,
        Message: "User with this username already exists!",
      });
    } else {
      //console.log("request sent true", req.body.username);
      res.status(200).send({
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const searchUser = async (req, res) => {
  try {
    const query = req.body.query;
    const result = await db.query(
      `SELECT id,username,email from Users WHERE username LIKE '${query}%';`
    );
    // console.log(result.rows);

    res.status(200).send({
      message: "users found with this name",
      users: result.rows,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

const updatePassword= async(req,res)=>{
  try {
    const newPass=req.body.password;
    const email=req.body.email;
    const done=await methods.encryptPassword(newPass);
    console.log( `update users set password=${done} where email=${email};`);
    const result = await db.query(
      `update users set password= '${done}' where email='${email}';`
    );
   // console.log(result)

    if(result){
      res.status(200).send({
          success:true,
          message:"Password changed successfully"
      })
    }

  } catch (error) {
    console.log(error);
  }
}
module.exports = {
  logOutUser,
  postSignUp,
  postLogin,
  getLogin,
  sendEmail,
  checkUserName,
  searchUser,
  updatePassword
};
