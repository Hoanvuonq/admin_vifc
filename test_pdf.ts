import fs from "fs";
import { pdfToThumbnail } from "./src/app/api/upload/pdf/route";

async function test() {
  try {
    const files = fs.readdirSync("./");
    const pdfFile = files.find((f) => f.endsWith(".pdf"));
    if (!pdfFile) {
      console.log("No PDF file found for testing");
      return;
    }
    const buffer = fs.readFileSync(pdfFile);
    const result = await pdfToThumbnail(buffer);
    console.log("Success! Buffer size:", result.length);
  } catch (err) {
    console.error("Error:", err);
  }
}
test();
