CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    account_type BOOLEAN NOT NULL,
    display_name VARCHAR(50) NOT NULL,
    dob DATE NOT NULL,
    about TEXT DEFAULT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE follows (
    user_id INTEGER NOT NULL,
    followed_user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, followed_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (followed_user_id) REFERENCES users(id)
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    replied_to INTEGER,
    body TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    privacy BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE tags (
    post_id INTEGER NOT NULL,
    tag_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id)
);

CREATE TABLE post_likes (
    post_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (post_id, user_id),
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE group_table (
    chat_id INTEGER NOT NULL UNIQUE,
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT DEFAULT NULL,
    join_link VARCHAR(100) NOT NULL UNIQUE,
    privacy BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE group_approvals (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    if_approved BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES group_table(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE group_admins (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES group_table(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE group_members (
    group_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (group_id, user_id),
    FOREIGN KEY (group_id) REFERENCES group_table(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);



CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    replied_to INTEGER,
    chat_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    if_unsent BOOLEAN DEFAULT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY (chat_id) REFERENCES group_table(chat_id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE blocked (
    blocked_id INTEGER NOT NULL,
    blocked_by INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocked_id, blocked_by),
    FOREIGN KEY (blocked_id) REFERENCES users(id),
    FOREIGN KEY (blocked_by) REFERENCES users(id)
);

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    is_group BOOLEAN NOT NULL
);

CREATE TABLE dm ( 
    chat_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (chat_id, user_id),
    FOREIGN KEY (chat_id) REFERENCES chat(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    header VARCHAR(20) NOT NULL,
    content TEXT NOT NULL,
    seen BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);