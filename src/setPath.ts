import moduleAlias from "module-alias";
import path from "path";

moduleAlias.addAliases({
  "@controllers": path.resolve(__dirname, "app/controllers"),
  "@configs": path.resolve(__dirname, "configs"),
  src: path.resolve(__dirname, ""),
});
