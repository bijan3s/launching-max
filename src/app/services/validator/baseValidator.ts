import Languages, { IAllowedLangs } from "src/utilities/localization/Languages";

interface ValidationField {
  value: any;
  errors: string[];
  bail: boolean;
  execute: boolean;
}

interface ValidationFields {
  [key: string]: ValidationField;
}

export interface Validations {
  [key: string]: string;
  required: string;
  min: string;
  max: string;
  string: string;
  int: string;
  intWithLength: string;
  date: string;
  boolean: string;
  email: string;
  mobile: string;
  unique: string;
  exists: string;
  enum: string;
  file_mimes: string;
}

class BaseValidator {
  protected validationFields: ValidationFields = {};
  protected currentField = "";
  protected language: IAllowedLangs = "fa";

  constructor(language?: IAllowedLangs) {
    language && (this.language = language);
  }

  private getLanguage() {
    const lang = Languages[this.language];
    if (!lang) {
      throw new Error(`Language ${this.language} is not supported.`);
    }
    return {
      attr: lang.Attributes,
      validations: lang.Validations,
    };
  }

  stopOnFirstError() {
    this.validationFields[this.currentField].bail = true;
    return this;
  }

  public shouldValidate(): boolean {
    const field = this.validationFields[this.currentField];
    return field.execute && (!field.bail || field.errors.length === 0);
  }

  private recordError(
    validationKey: string,
    replacements: (string | number)[] = [],
    append = ""
  ) {
    const { validations, attr } = this.getLanguage();
    const fieldName = attr[this.currentField] || this.currentField;

    let error = validations[validationKey]
      .replace("$attribute", fieldName)
      .replace("$a", String(replacements[0]))
      .replace("$b", String(replacements[1]));

    if (append) error += append;
    this.validationFields[this.currentField].errors.push(error);
  }

  required() {
    const fieldValue = this.validationFields[this.currentField].value;
    if (!fieldValue && fieldValue !== false && fieldValue !== 0)
      this.recordError("required");
    return this;
  }

  minLength(length: number) {
    let value = this.validationFields[this.currentField].value;
    if (typeof value === "number") value = value.toString();
    if (
      this.shouldValidate() &&
      (typeof value === "boolean" || value?.length < length)
    )
      this.recordError("min", [length]);
    return this;
  }

  maxLength(length: number) {
    let value = this.validationFields[this.currentField].value;
    if (typeof value === "number") value = value.toString();
    if (this.shouldValidate() && value?.length > length)
      this.recordError("max", [length]);
    return this;
  }

  string() {
    if (
      this.shouldValidate() &&
      typeof this.validationFields[this.currentField].value !== "string"
    )
      this.recordError("string");
    return this;
  }

  integer() {
    if (
      this.shouldValidate() &&
      typeof this.validationFields[this.currentField].value !== "number"
    )
      this.recordError("int");
    return this;
  }

  canBeInteger() {
    if (
      this.shouldValidate() &&
      isNaN(Number(this.validationFields[this.currentField].value))
    )
      this.recordError("int");
    return this;
  }

  exactDigits(len: number) {
    const value = this.validationFields[this.currentField].value;
    if (
      this.shouldValidate() &&
      (isNaN(Number(value)) || String(value).length !== len)
    )
      this.recordError("digits", [len]);
    return this;
  }

  between(min: number, max: number) {
    const value = Number(this.validationFields[this.currentField].value);
    if (this.shouldValidate() && (isNaN(value) || value < min || value > max))
      this.recordError("between", [min, max]);
    return this;
  }

  date() {
    const value = new Date(this.validationFields[this.currentField].value);
    if (
      this.shouldValidate() &&
      (typeof this.validationFields[this.currentField].value !== "string" ||
        isNaN(value.getTime()))
    )
      this.recordError("date");
    return this;
  }

  boolean() {
    if (
      this.shouldValidate() &&
      typeof this.validationFields[this.currentField].value !== "boolean"
    )
      this.recordError("boolean");
    return this;
  }

  array(min?: number, max?: number) {
    const value = this.validationFields[this.currentField].value;
    if (!this.shouldValidate() || !value) return this;
    if (!Array.isArray(value)) this.recordError("arr");
    if (min !== undefined && value.length < min)
      this.recordError("minArr", [min]);
    if (max !== undefined && value.length > max)
      this.recordError("maxArr", [max]);
    return this;
  }

  email() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (
      this.shouldValidate() &&
      !emailRegex.test(this.validationFields[this.currentField].value)
    )
      this.recordError("email");
    return this;
  }

  mobile() {
    const mobileRegex = /\b09\d{9}\b/;
    if (
      this.shouldValidate() &&
      !mobileRegex.test(this.validationFields[this.currentField].value)
    )
      this.recordError("mobile");
    return this;
  }

  sameAs(anotherField: string) {
    if (
      this.validationFields[this.currentField].value !==
      this.validationFields[anotherField].value
    ) {
      this.recordError("sameAs", [
        this.getLanguage().attr[anotherField] || anotherField,
      ]);
    }
    return this;
  }

  optional() {
    const value = this.validationFields[this.currentField].value;
    if (value === "" || value === null || value === undefined) {
      this.validationFields[this.currentField].errors = [];
      this.validationFields[this.currentField].execute = false;
    }
    return this;
  }

  enum(enums: string[]) {
    const value = this.validationFields[this.currentField].value;
    if (value && !enums.includes(value))
      this.recordError("enum", [], enums.join(", "));
    return this;
  }

  requiredIf(condition: boolean) {
    if (condition && !this.validationFields[this.currentField].value)
      this.recordError("required");
    return this;
  }

  async custom(callBack: (value: any) => Promise<any>): Promise<this> {
    const result = await callBack(
      this.validationFields[this.currentField].value
    );
    console.log("sending result ", result, typeof result);
    if (typeof result === "string") this.recordError(result);
    return this;
  }

  hasErrors(): boolean {
    return Object.values(this.validationFields).some(
      (field) => field.errors.length > 0
    );
  }

  errors() {
    const errors: { [key: string]: string[] } = {};
    Object.keys(this.validationFields).forEach((key) => {
      const field = this.validationFields[key];
      if (field.errors.length) {
        errors[key] = field.errors;
      }
    });
    return errors;
  }
}

export default BaseValidator;
