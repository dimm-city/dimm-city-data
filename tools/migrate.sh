DB_NAME=$1
#mysqldump -h dimm-city-mysql.mysql.database.azure.com -u founder@dimm-city-mysql -p --databases $DB_NAME > $DB_NAME.sql
mysql --ssl-ca=database/DigiCertGlobalRootCA.crt.pem  -h data-dimm-city.mysql.database.azure.com -u founder -p $DB_NAME < $DB_NAME.sql



export AZCOPY_CONCURRENCY_VALUE=AUTO;
export AZCOPY_CRED_TYPE=Anonymous;
./azcopy remove "https://dimmcity.blob.core.windows.net/tokens/dcs1r1/images/{101...3000}?sv=2021-10-04&se=2023-10-25T04%3A16%3A17Z&sr=c&sp=rdl&sig=w146czp3cuZLsYXLP8jK%2FYFGOxDYOb4czEZipoFLqog%3D" --from-to=BlobTrash  --recursive --log-level=INFO;
unset AZCOPY_CONCURRENCY_VALUE;
unset AZCOPY_CRED_TYPE;


export AZCOPY_CONCURRENCY_VALUE=AUTO;
./azcopy copy "https://dimmcity.blob.core.windows.net/test-tokens/dcs1r1/images/*?sv=2021-10-04&st=2023-09-25T04%3A11%3A20Z&se=2023-10-02T04%3A26%3A20Z&sr=c&sp=rlt&sig=FDlWOgyS4uGtFal2yR8nmrHS8Qsuh7eQyen9KDjmp2I%3D" "https://dimmcity.blob.core.windows.net/tokens/dcs1r1/images/?sv=2021-10-04&se=2023-10-25T04%3A26%3A59Z&sr=c&sp=rwlt&sig=843d3U3GzoWsgFNJoenV4F7uHuIB7Pe8DSBMHRzyEzQ%3D" --overwrite=prompt --from-to=BlobBlob --s2s-preserve-access-tier=false --check-length=true --include-directory-stub=false --s2s-preserve-blob-tags=true --list-of-files "/tmp/stg-exp-azcopy-fb1a63b1-09a5-4d95-9c64-01913fd9e2a6.txt" --recursive --log-level=INFO;
unset AZCOPY_CONCURRENCY_VALUE;


./azcopy copy "https://dimmcity.blob.core.windows.net/test-tokens/dcs1r1/images/*?sv=2021-10-04&st=2023-09-25T04%3A03%3A27Z&se=2023-09-29T04%3A03%3A00Z&sr=c&sp=rwdlf&sig=LQa2RNQSaCXAQW7RgwXXLGsGV7WzMBtquCr7qQsIGz4%3D" --overwrite=prompt --from-to=BlobBlob --s2s-preserve-access-tier=false --check-length=true --include-directory-stub=false --s2s-preserve-blob-tags=true --inlude-pattern {1...100}.png --recursive --log-level=INFO;




azcopy remove "https://dimmcity.blob.core.windows.net/tokens/dcs1r1/images/?sv=2021-10-04&st=2023-09-25T04%3A03%3A27Z&se=2023-09-29T04%3A03%3A00Z&sr=c&sp=rwdlf&sig=LQa2RNQSaCXAQW7RgwXXLGsGV7WzMBtquCr7qQsIGz4%3D" --from-to=BlobTrash --list-of-files "remove_images.txt" --recursive --log-level=INFO;
azcopy remove "https://dimmcity.blob.core.windows.net/tokens/dcs1r1/images/?sv=2021-10-04&st=2023-09-25T04%3A03%3A27Z&se=2023-09-29T04%3A03%3A00Z&sr=c&sp=rwdlf&sig=LQa2RNQSaCXAQW7RgwXXLGsGV7WzMBtquCr7qQsIGz4%3D" --from-to=BlobTrash --list-of-files "remove_json.txt" --recursive --log-level=INFO;


#!/bin/bash

for i in {101..3000}; do
  printf "%03d.png\n" $i >> remove_images.txt
done
