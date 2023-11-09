#!/bin/bash

timestamp=$(date +'%Y%m%d%H%M%S')

user_name="founder"
host="data-dimm-city.mysql.database.azure.com"
cert_path="../database/DigiCertGlobalRootCA.crt.pem"


# Parse command line options
while getopts ":d:s:" opt; do
  case $opt in
    d) destination_database=$OPTARG ;;
    s) source_database=$OPTARG ;;
    \?) echo "Invalid option -$OPTARG" >&2 ;;
  esac
done

# Set default values if not specified
destination_database=${destination_database:-"dimm_city_data_dev"}
source_database=${source_database:-"dimm_city_data_prod"}

# Collect password from user input
read -s -p "Enter password: " password


# Test login, if it fails, exit
echo ""
echo "Testing login to ${host}..."

# Select 1 row to test login
mysql --ssl-ca=${cert_path} -h ${host} -u ${user_name} -p${password} -Nse 'SELECT 1'

if [ $? -ne 0 ]; then
  echo "Login failed. Exiting..."
  exit 1
fi

# Array of tables to be excluded
excluded_tables=("admin_permissions"
  "admin_permissions_role_links"
  "admin_roles"
  "admin_users"
  "admin_users_roles_links"
  "strapi_api_token_permissions"
  "strapi_api_token_permissions_token_links"
  "strapi_api_tokens"
  "strapi_core_store_settings")

# Create ignore string for mysqldump
ignore_string=""
for table in "${excluded_tables[@]}"; do
  ignore_string+=" --ignore-table=${source_database}.${table}"
done

mkdir -p output

# Dump the source database excluding the specific tables
echo ""
echo "Copying data from ${source_database} to ${destination_database}..."
filename=${timestamp}_${source_database}.sql
echo "Dumping data to ${filename}"
mysqldump --ssl-ca=${cert_path} -h ${host} -u ${user_name} -p${password} ${source_database}${ignore_string} >output/${filename}

# Export destination database to SQL file
echo "Backing up ${destination_database}..."
mysqldump --ssl-ca=${cert_path} -h ${host} -u ${user_name} -p${password} ${destination_database} >output/${timestamp}_${destination_database}_backup.sql

# Import the data to the destination database
echo "Importing data to ${destination_database}..."
mysql --ssl-ca=${cert_path} -h ${host} -u ${user_name} -p${password} ${destination_database} <output/${filename}
