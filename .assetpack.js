import { pixiManifest } from "@assetpack/core/manifest";
import { msdfFont } from "@assetpack/core/webfont";
import { texturePacker } from "@assetpack/core/texture-packer";
import { json } from "@assetpack/core/json";

export default {
  entry: "./raw-assets",
  output: "./public/assets",
  pipes: [
    json(),
    texturePacker({
      texturePacker: {
        padding: 2,
        nameStyle: "relative",
        removeFileExtension: true,
      },
      resolutionOptions: {
        resolutions: { default: 1 },
      },
    }),
    msdfFont({
      font: {
        charset:
          " :.!'?abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        // generated font is having some artifacts in narrow areas, increase fontSize to fix issue
        fontSize: 80,
        vector: true,
        texturePadding: 1,
        border: 1,
      },
    }),
    pixiManifest({
      output: "./src/manifest.json",
      trimExtensions: true,
      includeMetaData: false,
    }),
  ],
};
