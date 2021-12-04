
USE mysql;
GO
UPDATE user SET host='%' WHERE user='root';
FLUSH PRIVILEGES;
GO
USE bcenginedb;
GO
CREATE TABLE test (
    id int,
    name VARCHAR(255)
);

INSERT INTO test(id, name)
VALUES(33, 'cool');