#! /bin/bash
echo "Skipping build..."
rsync -arv --no-o --no-g --ignore-existing --size-only  ./ /home/site/wwwroot
echo "Source sync done."
