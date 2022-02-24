docker build --pull --rm -f "Dockerfile" -t dimmcitydata:latest "."
docker build  -f "Dockerfile" -t dimmcitydata:latest "."

docker run --rm -it  -p 8080:8080/tcp dimmcitydata:latest 