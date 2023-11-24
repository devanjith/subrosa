const typescript = require("@rollup/plugin-typescript")

const config = [
  {
    input: "api/index.ts",
    output: {
      dir: "dist",
      format: "es",
    },
    plugins: [typescript()],
  },
]

module.exports = config
