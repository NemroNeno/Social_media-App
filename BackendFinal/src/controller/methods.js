const jwt = require("jsonwebtoken");
const db = require("../database/db");
const bcrypt = require("bcrypt");

async function getLoggedUser(req) {
  try {
   // console.log(req.headers.authorization);
    let logged_id = await jwt.decode(req.headers.authorization).payload;
    // console.log(logged_id);
    //  console.log('result not working')
    // let logged_id = await jwt.decode(req.cookies.login).payload;
    const results = await db.query(
      `SELECT id, username, password, private_account FROM Users WHERE id=${logged_id};`
    );
    if (results.rows.length > 0) {
      req.logged_user = results.rows.at(0);
      return results.rows.at(0);
    } else {
      return null; // No user found
    }
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function getUser(req) {
  if (req.body.username) {
    const ret = await getUserByUsername(req.body.username);
    return ret;
  } else {
    const ret = await getLoggedUser(req);
    return ret;
  }
}

function dateToString(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Note: Months are zero-based
  const day = date.getDate();

  let str = `${year}-${month}-${day}`;
  return str;
}

async function getUserDataByID(userID) {
  try {
    const data = await db.query(`
			SELECT u.display_name,u.id as id, u.username, u.display_name, about,u.image_url as image_url,
			(select count(*) from follows where user_id = ${userID}) AS following,
			(select count(*) from follows where followed_user_id = ${userID}) AS followers
			FROM Users u
			WHERE u.id = ${userID}
		`);
    return data.rows.at(0);
  } catch (err) {
    console.log(err.message);
    return null;
  }
}

async function checkIfBlocked(user_id, blocked_by_id) {
  try {
    const results = await db.query(`
			SELECT count(*) FROM blocked
			WHERE blocked_id = '${user_id}'
			AND blocked_by = '${blocked_by_id}'
		`);
  } catch (error) {
    console.log(error.message);
    return null;
  }
}

async function encryptPassword(password) {
  console.log(password, "this is password");
  if (!password) return null;
  let hashed_password = await bcrypt.hash(password, 10);
  return hashed_password;
}

async function getUserByEmail(email) {
  try {
    const results = await db.query(
      `SELECT id, username, password, private_account FROM Users WHERE email='${email}';`
    );
    if (results.rows.length > 0) {
      return results.rows.at(0);
    } else {
      return null; // No user found
    }
  } catch (error) {
    throw error;
  }
}

async function getUserByUsername(username) {
  try {
    const results = await db.query(
      `
			SELECT id, username, password, private_account,image_url FROM Users WHERE username = '${username}';
			`
    );
    if (results.rows.length > 0) {
      return results.rows.at(0);
    } else {
      return null; // No user found
    }
  } catch (error) {
    return null;
  }
}

async function getUserByEmailOrUsername(username) {
  try {
    const results = await db.query(`
		SELECT id, username, email, private_account,password
		FROM Users
		WHERE email = '${username}' OR username = '${username}';`);

    if (results.rows.length > 0) {
      return results.rows.at(0);
    } else {
      return null; // No user found
    }
  } catch (error) {
    throw error;
  }
}

async function getGroupIDByJoinLink(link) {
  try {
    const results = await db.query(`
		SELECT id FROM group_table
		WHERE join_link = ${link}`);
    console.log(results.rows.at(0));
    if (results.rows.length > 0) {
      return results.rows.at(0);
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

async function getGroupIDByChatID(chatID) {
  try {
    const results = await db.query(`
		SELECT id FROM group_table
		WHERE chat_id = ${chatID}`);
    //console.log(results.rows.at(0));
    if (results.rows.length > 0) {
      return results.rows.at(0);
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

const getAllChats = async (req) => {
  const user = await getLoggedUser(req);
  console.log('something')
  
  try {
    const results = await db.query(`
			SELECT
			u.username AS chat_name,
			c.id AS chat_id,
      
			'false' AS is_group
			FROM Users u
			JOIN dm ON dm.user_id = u.id
			JOIN Chat c ON c.id = dm.chat_id
			WHERE c.id IN (select chat_id from dm where user_id = ${user.id})
			AND u.id != ${user.id}
			UNION
			SELECT
			g.name AS chat_name,
			c.id AS chat_id,
			'true' AS is_group
			FROM group_table g
			JOIN Chat c ON c.id = g.chat_id
			JOIN group_members gm ON gm.group_id = g.id 
			WHERE gm.user_id = ${user.id}
      
		`);
    //const final = results.rows;
    //console.log(final);
    //console.log(results.rows);
    return results;
  } catch (error) {
    console.log(error);
  }
};

const getIdFromChat = async (chat_id) => {
  const results = await db.query(
    `select user_id from dm where chat_id=${chat_id}`
  );

  if (results) return results?.rows;

  const finalResult = await db.query(
    `select user_id from group_members where group_id=${chat_id}`
  );
  console.log("chaaaaat");
  // console.log(finalResult)

  return finalResult;
};

async function checkBlock(req, res, next) {
  try {
    const user_to_check = getUserByUsername(req.params.username);
    const user = await getLoggedUser(req);

    const results = await db.query(`
			SELECT 1 FROM blocked
			WHERE blocked_id = ${user_to_check.id}
			AND blocked_by = ${user.id}
		`);
    if (!results.rowCount) next();
    else {
      throw new Error("User is blocked.");
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}
async function checkFollow(req, res, next) {
  try {
    const user_to_check = getUserByUsername(req.params.username);
    const user = await getLoggedUser(req);

    const results = await db.query(`
			SELECT 1 FROM follows
			WHERE followed_user_id = ${user_to_check.id}
			AND user_id = ${user.id}
		`);
    if (results.rowCount) {
      req.followed = true;
      next();
    } else {
      req.followed = false;
      next();
    }
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
}

async function addMembers(groupId, members, req) {
  try {
    const user = await getLoggedUser(req);
    const idGroup = groupId[0].id;

    for (const data of members) {
      //console.log("this is single entry");
      const addedMember = await db.query(`
		INSERT INTO group_members (group_id, user_id)
		SELECT ${idGroup}, ${data.id}
		WHERE EXISTS (
			SELECT 1
			FROM group_table
			WHERE id = ${idGroup}
			AND private_group = 'false'
			)
			OR EXISTS (
				SELECT 1
				FROM group_admins
				WHERE group_id = ${idGroup}
				AND user_id = ${user.id}
				);
				`);

      if (addedMember.rowCount) {
        console.log("users added");
      } else {
        const addInApprovals = await db.query(`
			INSERT INTO group_approvals
			(group_id, user_id, if_approved)
			VALUES
			(${idGroup}, ${data.user_id}, 'false')
		`);

        if (addInApprovals.rowCount) {
          console.log("users not added");
        } else {
          throw new Error("Failed to join.");
        }
      }
    }

    console.log("functionEnded");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getIdFromChat,
  getLoggedUser,
  getUser,
  getUserByEmail,
  getUserByUsername,
  getUserByEmailOrUsername,
  encryptPassword,
  dateToString,
  getUserDataByID,
  checkIfBlocked,
  getGroupIDByJoinLink,
  getGroupIDByChatID,
  getAllChats,
  checkBlock,
  checkFollow,
  addMembers,
};
