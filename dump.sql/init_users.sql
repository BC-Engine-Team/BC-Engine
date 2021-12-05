
USE mysql;
GO
UPDATE user SET host='%' WHERE user='root';
FLUSH PRIVILEGES;
GO
USE bcenginedb;
GO
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(36), 
    user_email VARCHAR(255) NOT NULL, 
    user_password VARCHAR(255), 
    user_name VARCHAR(255), 
    user_role VARCHAR(255), 
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL, 
    PRIMARY KEY (user_id));

INSERT INTO users(user_id, user_email,
 user_password, 
 user_name, user_role, createdAt, updatedAt)
VALUES(
    UUID(), 
    'first@benoit-cote.com',   
    'veryStrongPassword', 
    'CJay', 
    'admin', 
    UTC_TIMESTAMP() - 50000, #this is an extremely scuffed way 
    UTC_TIMESTAMP() - 50000); #of gettin the current timestamp

INSERT INTO users(user_id, user_email,
 user_password, 
 user_name, user_role, createdAt, updatedAt)
VALUES(
    UUID(), 
    'second@benoit-cote.com',   
    'veryWeakPassword', 
    'Loik', 
    'employee', 
    UTC_TIMESTAMP() - 50000, #this is an extremely scuffed way 
    UTC_TIMESTAMP() - 50000); #of gettin the current timestamp

INSERT INTO users(user_id, user_email,
 user_password, 
 user_name, user_role, createdAt, updatedAt)
VALUES(
    UUID(), 
    'brayden@benoit-cote.com',   
    'veryWeakPassword', 
    'Brayden', 
    'admin', 
    UTC_TIMESTAMP() - 50000, #this is an extremely scuffed way 
    UTC_TIMESTAMP() - 50000); #of gettin the current timestamp