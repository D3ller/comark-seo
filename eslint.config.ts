import { karibsen } from "@karibsen/eslint-config";
import type { Linter } from "eslint";
import type { FlatConfigComposer } from "eslint-flat-config-utils";

const config: FlatConfigComposer<Linter.Config> = karibsen();

export default config;
