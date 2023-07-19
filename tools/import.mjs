import https from "https";
import { readdir, readFile } from "fs/promises";
import path from "path";

let strapi_api_key = process.argv[5] ?? process.env.STRAPI_API_KEY ?? "missing";
let directoryPath = process.argv[2] ?? path.join("../../extract-output");
let hostname = process.argv[3] ?? process.env.HOST ?? "localhost";
let port = process.argv[4] ?? process.env.PORT ?? 1337;
let races = [];
let specialties = [];
let locations = [];
let characterReleases = [];

const readEnvFile = async () => {
  try {
    const envFilePath = path.resolve(path.dirname("."), ".env");
    const envFileContent = await readFile(envFilePath, "utf8");
    const envVariables = {};

    envFileContent.split("\n").forEach((line) => {
      const [key, value] = line.split("=");
      envVariables[key] = value;
    });
    return envVariables;
  } catch (error) {
    console.error("Error reading .env file:", error);
  }
};
const getEntities = (contentType) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: hostname,
      port: port,
      path: `/api/dimm-city/${contentType}?pagination[pageSize]=1000`,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${strapi_api_key}`,
      },
    };

    const req = https.get(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const parsedData = JSON.parse(data);
          resolve(parsedData);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });
  });
};

const postEntity = (entity, contentType) => {
  const recordData = { data: { ...entity.attributes } };

  recordData.data.name ??= recordData.data.title;
  recordData.data.cybernetic ??= false;

  if (recordData.data.age > 99) {
    recordData.data.age = "Old Age";
  } else if (recordData.data.age > 45) {
    recordData.data.age = "Middle-Age";
  } else if (recordData.data.age > 21) {
    recordData.data.age = "Adulthood";
  } else {
    recordData.data.age = "Young Adulthood";
  }

  recordData.data.specialties = specialties.data
    .filter((specialty) => {
      const contains = recordData.data.specialties?.data?.some(
        (s) => specialty.attributes.name == s.attributes.name
      );
      return contains;
    })
    .map((specialty) => specialty.id);

  recordData.data.race = races.data
    .filter((r) => {
      const contains =
        recordData.data.race?.data?.attributes.name == r.attributes.name;
      return contains;
    })
    .map((r) => r.id);

  recordData.data.originLocation = locations.data
    .filter((l) => {
      const contains =
        recordData.data.originLocation?.data?.attributes.name ==
        l.attributes.name;
      return contains;
    })
    .map((l) => l.id);

  recordData.data.currentLocation = locations.data
    .filter((l) => {
      const contains =
        recordData.data.currentLocation?.data?.attributes.name ==
        l.attributes.name;
      return contains;
    })
    .map((l) => l.id);

  const data = JSON.stringify(recordData);

  const options = {
    hostname: hostname,
    port: port,
    path: `/api/dimm-city/${contentType}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // If needed, include your Strapi API key below
      Authorization: `Bearer ${strapi_api_key}`,
    },
  };

  const req = https.request(options, (res) => {
    if (res.statusCode < 200 || res.statusCode > 299)
      console.error(
        `\nstatusCode: ${res.statusCode}\n${recordData.data.id}${recordData.data}\n\n`
      );
    else console.log(`\nstatusCode: ${res.statusCode}\n`);

    res.on("data", (d) => {
      process.stdout.write(d);
    });
  });
  req.on("error", (error) => console.error(error, options.path));
  req.write(data);
  req.end();
};

/** Main function to wrap async calls
 *
 * @param {*} */
async function main() {
  try {
    const env = await readEnvFile();
    strapi_api_key = process.argv[5] ?? env.STRAPI_API_KEY ?? "missing";
    directoryPath = process.argv[2] ?? path.join("../../extract-output");
    hostname = process.argv[3] ?? env.HOST ?? "localhost";
    port = process.argv[4] ?? env.PORT ?? 1337;

    console.log(
      `Importing data from ${directoryPath} to ${hostname}:${port}...\n`
    );

    races = await getEntities("races");
    specialties = await getEntities("specialties");
    locations = await getEntities("locations");
    characterReleases = await getEntities("character-releases");

    //console.log(races, specialties, locations);

    await readdir(directoryPath)
      .then(async (files) => {
        for (const file of files) {
          const filePath = path.join(directoryPath, file);
          const contentType = file.split("_")[0];
          const entity = JSON.parse(await readFile(filePath, "utf8"));
          //console.log(entity);
          postEntity(entity, contentType);
        }
      })
      .catch(console.error);
    return "Success";
  } catch (error) {
    console.error(error);
    console.error(error.message, error.stack);
    console.error("Failed");
    process.exit(1);
  }
}

main()
  .then((value) => console.log(value))
  .catch((error) => console.log(error.message, error.stack));
