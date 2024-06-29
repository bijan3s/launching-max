import { Request } from "express";
import BaseValidator from "./baseValidator";
import { IAllowedLangs } from "src/utilities/localization/Languages";

class Validator extends BaseValidator {
  private $request: Request;

  constructor(req: Request) {
    super();
    if (req.headers["Language"] as IAllowedLangs)
      this.language = req.headers["Language"] as IAllowedLangs;
    this.$request = req;
    this.validationFields = {};
  }

  input(field: string, value: any) {
    this.currentField = field;
    this.validationFields[field] = {
      value,
      errors: [],
      bail: false,
      execute: true,
    };
    return this;
  }

  body(field: string) {
    const nested = field.split(".");
    this.currentField = field;
    if (nested.length > 1) {
      let _$field = this.$request.body;
      nested.forEach((n) => {
        if (_$field?.[n]) {
          _$field = _$field[n];
        }
      });
      this.validationFields[field] = {
        value: _$field,
        errors: [],
        bail: false,
        execute: true,
      };
    } else {
      this.validationFields[field] = {
        value: this.$request.body[field],
        errors: [],
        bail: false,
        execute: true,
      };
    }

    return this;
  }

  param(field: string) {
    this.currentField = field;
    this.validationFields[field] = {
      value: this.$request.params[field],
      errors: [],
      bail: false,
      execute: true,
    };
    return this;
  }

  query(field: string) {
    this.currentField = field;
    this.validationFields[field] = {
      value: this.$request.query[field],
      errors: [],
      bail: false,
      execute: true,
    };
    return this;
  }
}

export default Validator;
