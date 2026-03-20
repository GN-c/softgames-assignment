import { pixiManifest } from "@assetpack/core/manifest";
import { msdfFont } from "@assetpack/core/webfont";
import { texturePacker } from "@assetpack/core/texture-packer";

export default {
  entry: "./raw-assets",
  output: "./public/assets",
  pipes: [
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
          "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        "smart-size": true,
      },
    }),
    pixiManifest({
      output: "./src/manifest.json",
      trimExtensions: true,
      includeMetaData: false,
    }),
  ],
};
