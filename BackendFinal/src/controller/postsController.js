const db = require("../database/db");
const methods = require("./methods.js");

async function getAllPosts(req, res) {
  try {
    //  console.log(req.headers.authorization);
    const user = await methods.getLoggedUser(req);
    //  console.log("this user id will be looked for", user.id);

    const page = req.params.page;

    const results = await db.query(
      `
			SELECT
				p.id,
				p.replied_to,
				p.body,
				u.username,
				u.display_name,
        u.image_url as image_url,
				p.privacy,
				p.created_at,
				(select COUNT(DISTINCT pl.post_id) from post_likes pl where pl.user_id = ${
          user.id
        } and pl.post_id=p.id) AS if_liked,
        (select COUNT(*) from post_likes pl where pl.post_id = p.id) AS likes_count,
				(select COUNT(DISTINCT pr.id) from posts pr where pr.replied_to = p.id) AS reply_count
        

			FROM
				Posts p
			JOIN
				Users u ON u.id = p.user_id
			WHERE
		  replied_to IS NULL
			ORDER BY 
				p.created_at DESC,likes_count 
			LIMIT 20 OFFSET ${20 * page - 20};
		`
    );
    if (results.rowCount) {
      //    console.log(results.rows);
      res.json({
        posts: results.rows,
        success: true,
      });
    } else {
      throw new Error("Could not get.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Could not get posts.",
    });
  }
}

async function getPostsByUsername(req, res) {
  try {
    // const logged_user = await methods.getLoggedUser(req);
    const user = await methods.getUserByUsername(req.params.username);
    const page = req.params.page;

    let results = {};

    if (req.followed) {
      results = await db.query(
        `
				SELECT
				p.id,
				p.replied_to,
				p.body,
				u.username,
				u.display_name,
				p.privacy,
				p.created_at,
				(select COUNT(DISTINCT pl.post_id) from post_likes pl where pl.post_id = p.id) AS likes_count,
				(select COUNT(DISTINCT pr.id) from posts pr where pr.replied_to = p.id) AS reply_count
			FROM
				Posts p
			JOIN
				Users u ON u.id = p.user_id
			WHERE
				p.user_id = ${user.id}
			ORDER BY 
				p.created_at DESC
			LIMIT 20 OFFSET ${20 * page - 20};
			`
      );
    } else {
      results = await db.query(
        `
				SELECT
				p.id,
				p.replied_to,
				p.body,
				u.username,
				u.display_name,
				p.privacy,
				p.created_at,
				(select COUNT(*) from post_likes pl where pl.post_id =${
          user.id
        }) AS likes_count,
				(select COUNT(DISTINCT pr.id) from posts pr where pr.replied_to = p.id) AS reply_count
			FROM
				Posts p
			JOIN
				Users u ON u.id = p.user_id
			WHERE
				p.user_id = ${user.id} AND p.privacy = 'false'
			ORDER BY  
				p.created_at DESC
			LIMIT 20 OFFSET ${20 * page - 20};
			`
      );
    }

    if (results.rowCount) {
      res.json({
        posts: results.rows,
        success: true,
      });
    } else {
      throw new Error("Could not get.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not get posts.",
    });
  }
}

async function createPost(req, res) {
  try {
    const user = await methods.getLoggedUser(req);
    console.log();
    const data = req.body;

    // if (data.replied_to) {
    //   const checkIfPrivatePostAndCanBeReplied = await db.query(`
    //     SELECT user_id FROM posts WHERE id = ${data.replied_to}
    //   `)
    //   if (checkIfPrivatePostAndCanBeReplied.rowCount) {

    //   }
    // }

    let queryString = `INSERT INTO Posts (
				replied_to,
				body,
				user_id,
				privacy
			)
			VALUES (
				${data.replied_to},
				'${data.body}',
				${user.id},
				'${data.privacy}'
			)`;

    // replied_to is post_id which is being replied to, privacy is to be true for private post otherwise false
    const results = await db.query(queryString);
    if (results.rowCount) {
      res.json({
        success: true,
      });
    } else {
      throw new Error("Could not post.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Could not post!",
    });
  }
}

async function editPost(req, res) {
  try {
    const user = await methods.getLoggedUser(req);
    const data = req.body;

    // id is post_id
    const results = await db.query(
      `
			UPDATE Posts
			SET body = CONCAT('${data.body}', ' <edited>') , privacy = '${data.privacy}'
			WHERE user_id = ${user.id}
			AND id = ${req.params.id}
		`
    );
    if (results.rowCount) {
      res.json({
        success: true,
      });
    } else {
      throw new Error("Could not edit.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Could not edit!",
    });
  }
}

async function deletePost(req, res) {
  try {
    const user = await methods.getLoggedUser(req);

    // id is post_id
    const results = await db.query(
      `
			DELETE FROM Posts
			WHERE user_id = ${user.id}
			AND id = ${req.params.id}
		`
    );
    if (results.rowCount) {
      res.json({
        success: true,
      });
    } else {
      throw new Error("Could not delete.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not delete!",
    });
  }
}

async function likePost(req, res) {
  try {
    const user = await methods.getLoggedUser(req);
    //console.log(user)

    // id is post_id
    const results = await db.query(
      `
			INSERT INTO post_likes (post_id, user_id)
			VALUES(
				${req.params.id}, ${user.id}
			)
		`
    );
    if (results.rowCount) {
      console.log("liked");
      res.json({
        success: true,
      });
    } else {
      throw new Error("Could not like.");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Could not like!",
    });
  }
}

async function unlikePost(req, res) {
  try {
    const user = await methods.getLoggedUser(req);

    // id is post_id
    const results = await db.query(
      `
			DELETE FROM post_likes 
			WHERE post_id = ${req.params.id} AND user_id = ${user.id}
		`
    );
    if (results.rowCount) {
      console.log("liked");
      res.json({
        success: true,
      });
    } else {
      throw new Error("Could not unlike.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not unlike!",
    });
  }
}

async function openPost(req, res) {
  try {
    const postId = req.params.id;

    const post = await db.query(
      `
			SELECT
				p.id,
				p.replied_to,
				p.body,
				u.username,
				u.display_name,
				p.privacy,
				p.created_at,
				(select COUNT(DISTINCT pl.post_id) from post_likes pl where pl.post_id = p.id) AS likes_count,
				(select COUNT(DISTINCT pr.id) from posts pr where pr.replied_to = p.id) AS reply_count
			FROM
				Posts p
			JOIN
				Users u ON u.id = p.user_id
			WHERE
				p.id = ${postId}
		`
    );

    const replies = await db.query(
      `
			SELECT
				p.id,
				p.replied_to,
				p.body,
				u.username,
				u.display_name,
				p.privacy,
				p.created_at,
				(select COUNT(DISTINCT pl.post_id) from post_likes pl where pl.post_id = p.id) AS likes_count,
				(select COUNT(DISTINCT pr.id) from posts pr where pr.replied_to = p.id) AS reply_count
			FROM
				Posts p
			JOIN
				Users u ON u.id = p.user_id
			WHERE
				p.replied_to = ${postId}
			ORDER BY 
				p.created_at DESC
			LIMIT 50;
			`
    );
    if (post.rowCount) {
      res.json({
        post: post.rows.at(0),
        replies: replies.rows,
        success: true,
      });
    } else {
      throw new Error("Could not open.");
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Could not open!",
    });
  }
}

const getComments = async (req, res) => {
  try {
    const id = req.body.post_id;
    console.log(req.body);
    const results = await db.query(
      `
		select * from posts
			WHERE replied_to=${id}
		`
    );

    console.log(results.rows);
    res.status(200).send({
      message: "Comments sent successfully",
      success: true,
      comments: results.rows,
    });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getAllPosts,
  getPostsByUsername,
  createPost,
  deletePost,
  editPost,
  likePost,
  unlikePost,
  openPost,
  getComments,
};
