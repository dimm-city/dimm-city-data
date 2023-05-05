DB_NAME=$1
#mysqldump -h dimm-city-mysql.mysql.database.azure.com -u founder@dimm-city-mysql -p --databases $DB_NAME > $DB_NAME.sql
mysql --ssl-ca=database/DigiCertGlobalRootCA.crt.pem  -h data-dimm-city.mysql.database.azure.com -u founder -p $DB_NAME < $DB_NAME.sql 