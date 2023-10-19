#! /bin/bash
echo "Skipping build..."
echo "removing src, config"
rm -rf /home/site/wwwroot/src
rm -rf /home/site/wwwroot/config
rsync -arv --no-o --no-g --ignore-existing --size-only  ./ /home/site/wwwroot
echo "Source sync done."
