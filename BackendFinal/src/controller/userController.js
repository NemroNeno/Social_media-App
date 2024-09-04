const db = require("../database/db");
const methods = require("./methods.js");
const cloudinary = require("cloudinary");
const fs = require("fs");
const multer = require("multer");

cloudinary.config({
  cloud_name: "dglphhsmw",
  api_key: "192916527973826",
  api_secret: "BgELKUvgV3ArOY9I2iG4gM3oDbU",
});

async function getProfile(req, res) {
  try {
    const user = await methods.getUserByUsername(req.params.username);
    const logged_user = methods.getLoggedUser(req);

    if (!user) {
      res.json({
        message: "User not found!",
        success: false,
      });
      return;
    }

    let isBlocked = await methods.checkIfBlocked(user.id, logged_user.id);
    if (isBlocked) {
      res.json({
        message: `Cannot get profile. User is blocked!`,
        success: false,
      });
      return;
    }

    const results = await methods.getUserDataByID(user.id);
    res.json({
      results,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot get profile!",
      error: err.message,
      success: false,
    });
  }
}

async function updateProfile(req, res) {
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const results = await db.query(`
		UPDATE Users
		SET display_name='${data.display_name}',
			username='${data.username}',
			private_account = '${data.private_account}',
			dob = '${data.dob}',
			about = '${data.about}'
			phone = '${data.phone}'
		WHERE id=${user.user_id};`);

    res.status(200).json({ message: "Profile Updated Successfully!" });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getFollowers(req, res) {
  const user = await methods.getUserByUsername(req.params.username);

  if (!user) {
    res.json({
      message: "Cannot get followers!",
      success: false,
    });
  }

  try {
    let results = {};
    if (user.private_account) {
      const logged_user = await methods.getLoggedUser(req);
      results = await db.query(`
			SELECT display_name, username FROM Users u
			JOIN Follows f1 ON u.id = f1.user_id
			WHERE f1.followed_user_id = ${user.id}
			AND ${logged_user.id} IN f1.user_id
			`);
    } else {
      results = await db.query(`
			SELECT display_name, username FROM Users
			WHERE id IN (select user_id from follows where followed_user_id = ${user.id})
			`);
    }

    res.json({
      followers: results.rows,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot get followers!",
      error: err.message,
      success: false,
    });
  }
}

async function getFollowing(req, res) {
  const user = await methods.getUserByUsername(req.params.username);

  if (!user) {
    res.json({
      message: "Cannot get following!",
      success: false,
    });
  }

  try {
    let results = {};
    if (user.private_account) {
      const logged_user = await methods.getLoggedUser(req);
      results = await db.query(`
			SELECT display_name, username FROM Users u
			JOIN Follows f1 ON u.id = f1.followed_user_id
			WHERE f1.user_id = ${user.id}
			AND ${logged_user.id} IN f1.followed_user_id
			`);
    } else {
      results = await db.query(`
			SELECT display_name, username FROM Users
			WHERE id IN (select followed_user_id from follows where user_id = ${user.id})
			`);
    }
    // const results = await db.query(`
    // SELECT display_name, username FROM Users
    // WHERE id IN (select followed_user_id from follows where user_id = ${user.id})
    // `)

    res.json({
      following: results.rows,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot get following!",
      error: err.message,
      success: false,
    });
  }
}

async function followOrUnfollowUser(req, res) {
  // action is follow or unfollow
  const action = req.params.action;
  try {
    const user = await methods.getLoggedUser(req);
    if (!user) {
      res.json({
        message: `Failed to ${action} user!`,
        success: false,
      });
      return;
    }

    const user_to_follow_or_unfollow = await methods.getUserByUsername(
      req.params.username
    );
    if (!user_to_follow_or_unfollow) {
      res.json({
        message: "Invalid user!",
        success: false,
      });
      return;
    }

    let isBlocked = await methods.checkIfBlocked(
      user_to_follow_or_unfollow.id,
      user.id
    );
    if (isBlocked) {
      res.json({
        message: `Cannot ${action} blocked user!`,
        success: false,
      });
      return;
    }

    console.log(user);
    console.log(user_to_follow_or_unfollow);

    if (user.id == user_to_follow_or_unfollow.id) {
      res.json({
        message: `You cannot ${action} yourself!`,
        success: false,
      });
      return;
    }

    let results = {};
    if (action == "follow") {
      results = await db.query(`
			INSERT INTO Follows (user_id, followed_user_id)
			VALUES(${user.id}, ${user_to_follow_or_unfollow.id})
			`);
    } else if (action == "unfollow") {
      results = await db.query(`
			DELETE FROM Follows
			WHERE user_id = '${user.id}' AND followed_user_id = '${user_to_follow_or_unfollow.id}'
			`);
    }

    if (!results.rowCount) {
      res.json({
        message: `Failed to ${action} user!`,
        success: false,
      });
    } else {
      res.json({
        message: `User ${action}ed!`,
        success: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      message: `An error occured while ${action}ing!`,
      success: false,
    });
  }
}

async function getBlockList(req, res) {
  try {
    const user = await methods.getLoggedUser(req);
    console.log(user);

    if (!user) {
      res.json({
        message: "Please login first!",
        success: false,
      });
      return;
    }

    const results = await db.query(`
			SELECT u.display_name, u.username
			FROM Users u
			JOIN Blocked b ON u.id = b.blocked_by
			WHERE u.id = ${user.id}
		`);

    res.json({
      results,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Cannot get!", error: err.message, success: false });
  }
}

async function blockOrUnblockUser(req, res) {
  // action is follow or unfollow
  const action = req.params.action;
  try {
    const user = await methods.getLoggedUser(req);
    if (!user) {
      res.json({
        message: `Failed to ${action} user!`,
        success: false,
      });
      return;
    }

    const user_to_block_or_unblock = await methods.getUserByUsername(
      req.params.username
    );
    if (!user_to_block_or_unblock) {
      res.json({
        message: "Invalid user!",
        success: false,
      });
      return;
    }
    console.log(user);
    console.log(user_to_block_or_unblock);

    if (user.id == user_to_block_or_unblock.id) {
      res.json({
        message: `Attempted to ${action} yourself!`,
        success: false,
      });
      return;
    }

    let results = {};
    if (action == "block") {
      results = await db.query(`
			INSERT INTO Blocked (blocked_id, blocked_by)
			VALUES(${user_to_block_or_unblock.id}, ${user.id})

			DELETE FROM Follows
			WHERE user_id = '${user.id}' AND followed_user_id = '${user_to_block_or_unblock.id}'
			OR user_id = '${user_to_block_or_unblock.id}' AND followed_user_id = '${user.id}'
			`);
    } else if (action == "unblock") {
      results = await db.query(`
			DELETE FROM Blocked
			WHERE blocked_id = '${user_to_block_or_unblock.id}' AND blocked_by = '${user.id}'
			`);
    }

    if (!results.rowCount) {
      res.json({
        message: `Failed to ${action} user!`,
        success: false,
      });
    } else {
      res.json({
        message: `User ${action}ed!`,
        success: true,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.json({
      message: `An error occured while ${action}ing!`,
      success: false,
    });
  }
}

async function getNotifications(req, res) {
  try {
    const user = await methods.getLoggedUser(req);
    console.log(user);

    if (!user) {
      res.json({
        message: "Please login first!",
        success: false,
      });
      return;
    }

    const results = await db.query(`
			SELECT * FROM Notifications n
			JOIN Users u ON n.user_id = u.id
			WHERE u.id = '${user.id}'
		`);

    res.json({
      results,
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Cannot get profile!",
      error: err.message,
      success: false,
    });
  }
}

async function updateProfileImage(req, res) {
  try {
    //	const user = await methods.getLoggedUser(req);
    const user_id = req.fields.user_id;
    // const mode=req.fields.mode;
    const { image } = req.files;
    console.log(user_id, "For picture uploading");

    const result = await cloudinary.v2.uploader.upload(image.path, {
      public_id: `${user_id}`,
      folder: "profiles"
    });
    const st = `UPDATE users
    SET image_url = "${result.secure_url}"
    WHERE id = ${user_id}`;
    console.log(st);

    const save = await db.query(`
    UPDATE users
    SET image_url = '${result.secure_url}'
  WHERE id = ${user_id};
		`);
    res.json({
      success: true,
      message: "Profile picture updated.",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: "Updation falied.",
    });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  getFollowers,
  getFollowing,
  followOrUnfollowUser,
  getBlockList,
  blockOrUnblockUser,
  getNotifications,
  updateProfileImage,
};
