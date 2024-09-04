const { query } = require("express");
const db = require("../database/db");
const methods = require("./methods.js");

async function createGroup(req, res) {
  const user = req.body.user_id;
  const data = req.body;

  try {
    const gc = await db.query(`
        WITH inserted_chat AS (
        INSERT INTO Chat (is_group)
        VALUES ('true')
        RETURNING id
        ), inserted_group AS (
        INSERT INTO group_table (chat_id, name, description, join_link, private_group)
        SELECT
            id,
            '${data.group_name}',
            '${data.group_description}',
            CONCAT(${Math.floor(Math.random() * 10000)}, id),
            '${data.private_group}'
        FROM inserted_chat
        RETURNING id
        )
        INSERT INTO group_admins (group_id, user_id)
        SELECT
        id AS group_id,
        ${user} AS user_id
        FROM inserted_group
        ;
        `);
    //console.log(gc.rowCount);
    if (gc.rowCount) {
      const newId = await db.query(
        "select id from group_table order by created_at desc limit 1"
      );
      const mem = data.members;
      mem.push(req.body.admin);
      console.log(mem);
      await methods.addMembers(newId.rows, mem, req);

      res.json({
        message: "Group created.",
        success: true,
      });
    } else {
      throw new Error("Failed to create group.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getJoinedGroupsList(req, res) {
  const user = await methods.getLoggedUser(req);

  try {
    const group = await db.query(`
            SELECT name, chat_id
            FROM group_table g
            JOIN group_members gm ON gm.group_id = g.id
            WHERE gm.user_id = ${user.id}
        `);

    if (group.rowCount) {
      res.json({
        list: group.rows,
        success: true,
      });
    } else {
      throw new Error("Failed to fetch.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getGroupInfo(req, res) {
  const user = await methods.getLoggedUser(req);
  const chatID = req.params.chatid;

  try {
    const group = await db.query(`
            SELECT name, description, created_at, private_group, chat_id,(select user_id from group_admins)
            FROM group_table
            WHERE chat_id = ${chatID}
            AND EXISTS (SELECT 1 FROM group_members WHERE chat_id = ${chatID} AND user_id = ${user.id})
        `);

    if (group.rowCount) {
      res.json({
        group_info: group.rows.at[0],
        success: true,
      });
    } else {
      throw new Error("Failed to fetch.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function editGroup(req, res) {
  const chatID = req.params.chatid;
  const groupID = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const groupEdit = await db.query(`
            UPDATE group_table
            SET name = ${data.name},
            description = ${data.description}, 
            private_group = ${data.private_group}
            WHERE chat_id = ${chatID}
            AND EXISTS (SELECT count(*) FROM group_admins WHERE group_id = ${groupID} AND user_id = ${user.id})
        `);

    if (groupEdit.rowCount) {
      res.json({
        message: "Changes saved.",
        success: true,
      });
    } else {
      throw new Error("Failed to update data.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

// have to think whether to include this function or not
async function deleteGroup(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const adminLogin = await db.query(
      `SELECT 1 FROM group_admins WHERE group_id = ${groupId} and ${user.id} IN (group_admins.user_id)`
    );
    if (!adminLogin.rowCount) {
      res.json({
        message: "Only admins can delete group.",
        success: false,
      });
      return;
    }
    const groupDel = await db.query(`
            DELETE FROM group_admins
            WHERE group_id = ${groupId}
            AND EXISTS (
                SELECT 1 
                FROM group_table 
                WHERE id = ${groupId}
            );
            
            DELETE FROM group_members
            WHERE group_id = ${groupId};
            
            DELETE FROM group_approvals
            WHERE group_id = ${groupId};
            
            DELETE FROM Chat
            WHERE id = (
                SELECT chat_id 
                FROM group_table 
                WHERE id = ${groupId}
            );
            
            DELETE FROM group_table
            WHERE id = ${groupId};            
        `);

    if (groupDel.rowCount) {
      res.json({
        message: "Changes saved.",
        success: true,
      });
    } else {
      throw new Error("Failed to update data.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getGroupMembers(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  console.log(groupId);
  const data = req.body;

  try {
    const gMems = await db.query(`
            SELECT display_name, username from Users u
            JOIN group_members gm ON u.id = gm.user_id
            WHERE 
                gm.group_id = ${groupId.id}
           
        `);

    if (gMems.rowCount) {
      res.json({
        members: gMems.rows,
        success: true,
      });
    } else {
      throw new Error("Failed to get info.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function addGroupMember(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;
  // check later that fontend could send invalid data.user_id

  try {
    const addedMember = await db.query(`
            INSERT INTO group_members (group_id, user_id)
            SELECT ${groupId}, ${data.user_id}
            WHERE EXISTS (
                SELECT 1
                FROM group_table
                WHERE id = ${groupId}
                AND private_group = 'false'
            )
            OR EXISTS (
                SELECT 1
                FROM group_admins
                WHERE group_id = ${groupId}
                AND user_id = ${user.id}
            );
        `);

    if (addedMember.rowCount) {
      res.json({
        message: "Group joined.",
        join_status: 1,
        success: true,
      });
    } else {
      const addInApprovals = await db.query(`
                INSERT INTO group_approvals
                (group_id, user_id, if_approved)
                VALUES
                (${groupId}, ${data.user_id}, 'false')
            `);

      if (addInApprovals.rowCount) {
        res.json({
          message: "Group join request sent to admin.",
          join_status: 2,
          success: true,
        });
      } else {
        throw new Error("Failed to join.");
      }
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      join_status: 0,
      success: false,
    });
  }
}

async function removeGroupMember(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const removedMember = await db.query(`
            DELETE FROM group_members
            WHERE group_id = ${groupId}
            AND EXISTS (
                SELECT 1
                FROM group_admins
                WHERE group_id = ${groupId}
                AND user_id = ${user.id}
            );
        `);

    if (removedMember.rowCount) {
      res.json({
        message: "Removed from group.",
        success: true,
      });
    } else {
      throw new Error("Failed to remove.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getGroupAdmins(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const groupAdmins = await db.query(`
            SELECT display_name, username from Users u
            JOIN group_admins ga ON u.id = ga.user_id
            WHERE ga.group_id = ${groupId}
            AND (EXISTS (SELECT 1 from group_members WHERE user_id = ${user.id} AND group_id = ${groupId})
            OR EXISTS (SELECT 1 FROM group_table WHERE group_id = ${groupId} AND private_group = 'false'))
        `);

    if (groupAdmins.rowCount) {
      res.json({
        admins: groupAdmins.rows,
        success: true,
      });
    } else {
      throw new Error("Failed to get info.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function checkGroupAdmin(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  // const data = req.body;
  console.log(user.id, groupId);

  try {
    const IsAdmin = await db.query(`SELECT * FROM group_admins
            WHERE group_id = ${groupId.id} and user_id = ${user.id}`);

    if (IsAdmin.rowCount) {
      res.json({
        message: "Indeed this is Admin",
        success: true,
        isAdmin: true,
      });
    } else {
      res.json({
        message: "He is not admin",
        success: false,
        isAdmin: false,
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

async function removeGroupAdmin(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const removedAdmin = await db.query(`
           DELETE FROM group_admins
           WHERE user_id = ${data.user_id} AND group_id = ${groupId}
           AND EXISTS (SELECT 1 FROM group_admins WHERE group_id = ${groupId} and user_id = ${user.id})
        `);

    if (removedAdmin.rowCount) {
      res.json({
        message: "Admin removed",
        success: true,
      });
    } else {
      throw new Error("Failed to remove admin.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function getApprovalsList(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const approvalsList = await db.query(`
            SELECT display_name, username from Users u
            JOIN group_approvals gp ON gp.user_id = u.id
            JOIN group_admins ga ON ga.group_id = gp.group_id
            WHERE ${user.id} IN (ga.user_id)
        `);

    if (approvalsList.rowCount) {
      res.json({
        approvals: approvalsList.rows,
        success: true,
      });
    } else {
      throw new Error("Failed to get info.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function approveJoinRequest(req, res, next) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const approve = await db.query(`
        DELETE FROM group_approvals 
        WHERE group_id = ${groupId} AND user_id = ${data.user_id}
        `);

    if (approve.rowCount) {
      next();
    } else {
      throw new Error("Failed to approve join request.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

async function disapproveJoinRequest(req, res) {
  const chatID = req.params.chatid;
  const groupId = await methods.getGroupIDByChatID(chatID);
  const user = await methods.getLoggedUser(req);
  const data = req.body;

  try {
    const disapprove = await db.query(`
        DELETE FROM group_approvals 
        WHERE group_id = ${groupId} AND user_id = ${data.user_id}
        `);

    if (disapprove.rowCount) {
      res.json({
        message: "Request deleted.",
        success: true,
      });
    } else {
      throw new Error("Failed to remove request.");
    }
  } catch (error) {
    console.log(error.message);
    res.json({
      message: "An error occured.",
      success: false,
    });
  }
}

module.exports = {
  createGroup,
  getJoinedGroupsList,
  getGroupInfo,
  editGroup,
  deleteGroup,
  getGroupMembers,
  removeGroupMember,
  addGroupMember,
  getGroupAdmins,
  checkGroupAdmin,
  removeGroupAdmin,
  getApprovalsList,
  approveJoinRequest,
  disapproveJoinRequest,
};
