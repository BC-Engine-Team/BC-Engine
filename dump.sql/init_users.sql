
USE mysql;
GO
UPDATE user SET host='%' WHERE user='root'; #Probably unsafe but necessary to work rn
FLUSH PRIVILEGES;
GO