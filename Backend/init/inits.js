import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


import Stone from "../models/stone.js";
import WomenCategory from "../models/womencategory.js";
import MenCategory from "../models/mencategory.js";
import MenRings from "../models/menrings.js";
import Necklaces from "../models/necklaces.js";
import Earrings from "../models/earring.js";
import WomenRing from "../models/womenring.js";
import StoneData from "./stone.js";
import collectionData from "./collectiondata.js";
import womencategorydata from "./womencategorydata.js";
import womenringdata from "./womenringdata.js";
import mencategorydata from "./mencategorydata.js";
import menringdata from "./menring.js";
import necklacesdata from "./necklacesdata.js";
import earringdata from "./earringdata.js";
import Collections from "../models/Collection.js";
import collectionsData from "./collectionsData.js";
import gemstonesData from "./gemstonesData.js";
import GemStoneData from "../models/Gemstone.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", ".env"),
});

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || "StoneGemz";

const buildMongoUri = (rawUri, dbName) => {
  if (!rawUri) {
    throw new Error("MONGODB_URI or MONGO_URI is required to seed the database.");
  }

  const [baseUri, queryString] = rawUri.trim().split("?");
  const normalizedBaseUri = baseUri.endsWith("/")
    ? baseUri.slice(0, -1)
    : baseUri;
  const withoutProtocol = normalizedBaseUri.replace(
    /^mongodb(?:\+srv)?:\/\//i,
    ""
  );
  const databasePath = withoutProtocol.includes("/")
    ? normalizedBaseUri
    : `${normalizedBaseUri}/${dbName}`;
  const searchParams = new URLSearchParams(queryString || "");

  searchParams.set("retryWrites", searchParams.get("retryWrites") || "true");
  searchParams.set("w", searchParams.get("w") || "majority");
  searchParams.set("authSource", searchParams.get("authSource") || "admin");
  searchParams.set("appName", searchParams.get("appName") || "GemStone");

  return `${databasePath}?${searchParams.toString()}`;
};

async function main() {
  await mongoose.connect(buildMongoUri(MONGODB_URI, MONGO_DB_NAME), {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
}

const StoneDB = async () => {
  await Stone.deleteMany({});
  await Stone.insertMany(StoneData);
};

const WomenRings = async () => {
  await WomenRing.deleteMany({});
  await WomenRing.insertMany(womenringdata);
  console.log("Women rings inserted");
};

const CollectionData = async () => {
  await Collections.deleteMany({});
  const mapped = collectionData.map((item) => ({
    name: item.categoryTitle || item.name || "",
    image: item.image || "",
    description: item.description || item.price || "",
  }));

  await Collections.insertMany(mapped);
};

const Womencategory = async () => {
  await WomenCategory.deleteMany({});
  await WomenCategory.insertMany(womencategorydata);
};

const Mencategory = async () => {
  await MenCategory.deleteMany({});
  await MenCategory.insertMany(mencategorydata);
};

const insertMenRings = async () => {
  await MenRings.deleteMany({});
  await MenRings.insertMany(menringdata);
};

const Necklace = async () => {
  await Necklaces.deleteMany({});
  await Necklaces.insertMany(necklacesdata);
};

const Earring = async () => {
  await Earrings.deleteMany({});
  const earringsWithProductCodes = earringdata.map((earring, index) => ({
    ...earring,
    productCode: earring.productCode || `ER-${String(index + 1).padStart(3, "0")}`,
  }));
  await Earrings.insertMany(earringsWithProductCodes);
};

const seedCollections = async () => {
  await Collections.deleteMany({});
  await Collections.insertMany(collectionsData);
};

const insertGemstones = async () => {
  try {
    await GemStoneData.deleteMany({});

    const collections = await Collections.find();

    const collectionMap = {};
    collections.forEach((item) => {
      collectionMap[item.slug] = item._id;
    });

    const formattedData = gemstonesData.map((item) => ({
      name: item.name,
      slug: item.slug,
      gemCollection: collectionMap[item.collectionSlug],
      image: item.image,
      images: item.images,
      productCode: item.productCode,
      weight: item.weight,
      shape: item.shape,
      price: item.price,
      category: item.category,
      stockquantity: item.stockquantity,
      featured: item.featured,
      shortDescription: item.shortDescription,
      description: item.description,
      metaTitle: item.metaTitle,
      metaDescription: item.metaDescription,
    }));

    await GemStoneData.insertMany(formattedData);

    console.log("Gemstones Inserted Successfully");
  } catch (err) {
    console.log(err);
  }
};

const seedDB = async () => {
  await StoneDB();
  await WomenRings();
  await Womencategory();
  await Mencategory();
  await insertMenRings();
  await Necklace();
  await Earring();
  await seedCollections();
  await insertGemstones();
};

main()
  .then(async () => {
    console.log("Connected to DB");
    await seedDB();
    console.log("Seeding complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });