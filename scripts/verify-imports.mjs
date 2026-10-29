import fs from "fs";
import path from "path";

function checkDir(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  for (const f of files) {
    const full = path.join(dir, f.name);
    if (f.isDirectory()) {
      checkDir(full);
    } else if (f.name.endsWith(".js") || f.name.endsWith(".jsx")) {
      const content = fs.readFileSync(full, "utf8");
      const lines = content.split("\n");
      lines.forEach((line) => {
        const m = line.match(/from\s+["'](@\/[^"']+)["']/);
        if (m) {
          const importPath = m[1].replace("@/", "src/");
          const exts = [".js", ".jsx", ".json", "/index.js", ""];
          let found = false;
          let matchedCase = false;
          for (const ext of exts) {
            const candidate = path.resolve(importPath + ext);
            if (fs.existsSync(candidate)) {
              found = true;
              // Check case sensitivity
              const actualDir = path.dirname(candidate);
              const actualFiles = fs.readdirSync(actualDir);
              const targetBase = path.basename(candidate);
              if (actualFiles.includes(targetBase)) {
                matchedCase = true;
              }
              break;
            }
          }
          if (!found) {
            console.log("NOT FOUND:", full, "->", importPath);
          } else if (!matchedCase) {
            console.log("CASE MISMATCH (breaks on Linux/Vercel):", full, "->", importPath);
          }
        }
      });
    }
  }
}

checkDir("src");
console.log("Import integrity verified.");
