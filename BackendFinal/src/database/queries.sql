
-- NOTE: THIS IS JUST A HELP FILE

-- help: \?
-- list of databases: \l
-- list of tables/relations: \d
-- view table/relation: \d <table_name>
-- view all functions: \df

CREATE DATABASE <dbname> --(create database)
DROP DATABASE <dbname> --(delete database)
DROP TABLE <table_name> --(delete table)
ALTER TABLE <table_name> ADD COLUMN <column_name> <data_type>; --(add new column)
ALTER TABLE <table_name> DROP COLUMN <column_name>; --(delete a column)


-- CHECK CONSTRAINTS
SELECT conname, conrelid::regclass AS table_name, pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'your_table_name'::regclass;




--------- USERS
CREATE TABLE Users (
    id BIGSERIAL NOT NULL PRIMARY KEY, --automatic
    name VARCHAR(64) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL check(email LIKE '%_@__%.__%'),
    username VARCHAR(32) UNIQUE NOT NULL check(username LIKE '%[A-Za-z0-9_.]%'), -- this constraint is currently dropped
    password VARCHAR(128) NOT NULL
);

CREATE TABLE Follows (
    id BIGSERIAL NOT NULL PRIMARY KEY, --automatic
    user_id INT NOT NULL REFERENCES Users(id),
    followed_user_id BIGINT NOT NULL REFERENCES Users(id)
);
alter table follows add constraint not_follow_oneself_check CHECK (user_id <> followed_user_id)


-- CREATE TABLE Posts (
--     post_id BIGSERIAL NOT NULL PRIMARY KEY,
--     date_time TIMESTAMP WITH TIME ZONE NOT NULL,
--     upvotes INT NOT NULL,
--     downvotes INT NULL
-- );


-- CREATE TABLE Votes (
--     vote_id BIGSERIAL NOT NULL PRIMARY KEY,
--     post_id BIGINT REFERENCES Posts(post_id),
--     voter_id INT REFERENCES Users(user_id),
--     vote_type CHARACTER(1) NOT NULL check(vote_type IN ('U', 'D')) -- U: Up, D: Down
-- );

