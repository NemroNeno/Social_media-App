const db = require("../database/db");
const methods = require("./methods.js");

async function createDM(req, res) {
  const user1 = await methods.getLoggedUser(req);
  const user2 = await methods.getUserByUsername(req.params.username);
  if (!user2) return;
  // console.log( user2);

  try {
   // console.log("clicked chat");
    const checkAlreadyExist = await db.query(`
            SELECT chat_id FROM dm d
            WHERE d.user_id = ${user1.id}
            AND EXISTS (SELECT 1 FROM dm where chat_id = d.chat_id AND user_id = ${user2.id})
        `);
    if (checkAlreadyExist.rowCount) {
      //console.log(checkAlreadyExist.rows);
      res.json({
        chat_id: checkAlreadyExist.rows[0],
        otheruser: req.params.username,
        message: "Chat exists.",
        success: true,
        new: false,
      });
      return;
    }

    const dm = await db.query(`
            WITH inserted_chat AS (
                INSERT INTO Chat (is_group)
                VALUES ('false')
                RETURNING id
            )
            INSERT INTO dm (chat_id, user_id)
            SELECT id, ${user1.id} FROM inserted_chat
            WHERE NOT EXISTS (SELECT 1 FROM dm WHERE user_id = ${user2.id} AND chat_id = ANY (SELECT chat_id FROM dm WHERE user_id = ${user1.id}))
            UNION ALL
            SELECT id, ${user2.id} FROM inserted_chat
            WHERE NOT EXISTS (SELECT 1 FROM dm WHERE user_id = ${user2.id} AND chat_id = ANY (SELECT chat_id FROM dm WHERE user_id = ${user1.id}))
            `);

    if (dm.rowCount) {
      const checkAlreadyExist = await db.query(`
            SELECT chat_id FROM dm d
            WHERE d.user_id = ${user1.id}
            AND EXISTS (SELECT 1 FROM dm where chat_id = d.chat_id AND user_id = ${user2.id})
        `);

      // console.log(checkAlreadyExist.rows);

      res.json({
        chat_id: checkAlreadyExist.rows[0],
        message: "Chat initiated.",
        otheruser: req.params.username,
        success: true,
        new: true,
      });
    } else {
      throw new Error("Failed to initiate.");
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getMessages(req, res) {
  try {
    // console.log("this is params",req.params.id);
    const user = await methods.getLoggedUser(req);
    const chat_id = req.params.id;
  
   // console.log(user.id,chat_id,"this are the params passed")
    //console.log("CHAT ID 1", chat_id);
    const checks = await db.query(`
        SELECT 1
        FROM Chat c
        WHERE c.id = ${chat_id}
            AND (
                (c.is_group = true AND EXISTS (
                    SELECT 1
                    FROM group_table g
                    JOIN group_members gm ON gm.group_id = g.id
                    WHERE g.chat_id = c.id
                    AND ${user.id} IN (gm.user_id)
                    ))
                    OR
                    (c.is_group = false AND EXISTS (
                        SELECT 1
                        FROM dm
                        WHERE dm.chat_id = c.id
                        AND ${user.id} IN (dm.user_id)
                ))
            )
            `);

    if (!checks.rowCount) {
      res.json({
        message: "Unauthorized.",
        success: false,
      });
      return;
    }
    // console.log("CHAT ID 2", chat_id);
    const messages = await db.query(`
                SELECT 
                m.id,
                    CASE 
                    WHEN (m.if_unsent IS NULL) THEN m.content
                    ELSE 'This message was unsent'
                END AS content,
                m.created_at, m.replied_to, u.username, u.display_name,m.user_id
                FROM messages m
                JOIN Users u ON u.id = m.user_id
                JOIN Chat c ON m.chat_id = c.id
                WHERE c.id = ${chat_id}
                AND (m.if_unsent IS NULL)
                order by created_at ASC;
            `);

    if (messages.rowCount) {
      //console.log(messages);
      res.json({
        messages: messages.rows,
        success: true,
      });
    } else {
      res.json({
        messages: messages.rows,
        success: true,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function sendMessage(req, res) {
  const user = await methods.getLoggedUser(req);
  const chat_id = req.params.id;
  const data = req.body;
  console.log("this is chat id", data);

  try {
    const checks = await db.query(`
        SELECT 1
        FROM Chat c
        WHERE c.id = ${chat_id}
            AND (
                (c.is_group = true AND EXISTS (
                    SELECT 1
                    FROM group_table g
                    JOIN group_members gm ON gm.group_id = g.id
                    WHERE g.chat_id = c.id
                    AND ${user.id} IN (gm.user_id)
                ))
                OR
                (c.is_group = false AND EXISTS (
                    SELECT 1
                    FROM dm
                    WHERE dm.chat_id = c.id
                    AND ${user.id} IN (dm.user_id)
                ))
            )
        `);

    if (!checks.rowCount) {
      res.json({
        message: "Unauthorized.",
        success: false,
      });
      return;
    }
    if (data.replied_to) {
      const message = await db.query(`
            INSERT INTO messages
            (content, replied_to, chat_id, user_id)
            SELECT
            '${data.content}', '${data.replied_to}', ${chat_id}, ${user.id}

            WHERE NOT EXISTS (SELECT ${data.replied_to}) OR
            EXISTS (SELECT 1 FROM messages WHERE chat_id = ${chat_id} AND id = ${data.replied_to})
            `);
      if (message.rowCount) {
        const newMessage =
          await db.query(`select * from messages where chat_id= ${chat_id}
        order by created_at desc limit 1;`);
        res.json({
          message: "Message sent.",
          success: true,
          content: newMessage.rows[0],
        });
      } else {
        throw new Error("Failed to send message 1.");
      }
    } else {
      const message = await db.query(`
            INSERT INTO messages
            (content, chat_id, user_id)
            SELECT
            '${data.content}', ${chat_id}, ${user.id}

            
            `);
      if (message.rowCount) {
        const newMessage = await db.query(
          `select * from messages order by created_at desc limit 1;`
        );

        // console.log(newMessage.rows[0]);
        res.json({
          message: "Message sent.",
          success: true,
          content: newMessage.rows[0],
        });
      } else {
        throw new Error("Failed to send message 2.");
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function unsendMessage(req, res) {
  const user = await methods.getLoggedUser(req);
  const chat_id = req.params.id;
  const data = req.body;

  try {
    const checks = await db.query(`
        SELECT 1
        FROM Chat c
        WHERE c.id = ${chat_id}
            AND (
                (c.is_group = true AND EXISTS (
                    SELECT 1
                    FROM group_table g
                    JOIN group_members gm ON gm.group_id = g.id
                    WHERE g.chat_id = c.id
                    AND ${user.id} IN (gm.user_id)
                ))
                OR
                (c.is_group = false AND EXISTS (
                    SELECT 1
                    FROM dm
                    WHERE dm.chat_id = c.id
                    AND ${user.id} IN (dm.user_id)
                ))
            )
        `);

    if (!checks.rowCount) {
      res.json({
        message: "Unauthorized.",
        success: false,
      });
      return;
    }

    const message = await db.query(`
            UPDATE messages
            SET if_unsent = 'true', replied_to = NULL
            WHERE chat_id = ${chat_id}
            AND id = ${data.message_id}
            AND user_id = ${user.id}
            `);

    if (message.rowCount) {
      res.json({
        message: "Message deleted.",
        success: true,
      });
    } else {
      throw new Error("Failed to get.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

const getRecentChats = async (req, res) => {
  try {
    console.log(req.headers.authorization)
    const result = await methods.getAllChats(req);
   // console.log("this is final");
     // console.log(result);
    if (result) {
      res.status(200).send({
        success: true,
        chats: result.rows,
      });
    } else {
      res.status(200).send({
        success: false,
        message: "There does not exist any chat for this user",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createDM,
  getMessages,
  sendMessage,
  unsendMessage,
  getRecentChats,
};
