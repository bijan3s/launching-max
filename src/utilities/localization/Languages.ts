import { Validations } from "src/app/services/validator/baseValidator";
import { faValidations, faAttributes } from "./fa/validation";

export type IAllowedLangs = "fa";

const Languages = {
  fa: {
    Attributes: faAttributes,
    Validations: faValidations as unknown as Validations,
  },
};

export default Languages;
