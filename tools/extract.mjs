import https from "https";
import { writeFile } from "fs/promises";
import path from "path";

const contentType = process.argv[2];
const url = `https://data.dimm.city/api/${contentType}?populate=*&pagination[pageSize]=1000`;

https
  .get(url, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", async () => {
      const jsonData = JSON.parse(data);
      for (let i = 0; i < jsonData.data.length; i++) {
        const entity = jsonData.data[i];
        const json = JSON.stringify(entity, null, 2);
        const fileName = path.join("../../extract-output", `${contentType}_${i}.json`);

        try {
          await writeFile(fileName, json);
          console.log(`File ${fileName} has been written.`);
        } catch (error) {
          console.error(`Error writing file: ${error}`);
        }
      }
    });
  })
  .on("error", (error) => {
    console.error(`Error fetching data: ${error}`);
  });
