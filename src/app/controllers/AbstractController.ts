import { Request } from "express";
import mongoose from "mongoose";

type TSearchResponse = {
  $or?: {
    [key: string]: { $regex: any; $options: string };
  }[];
  $and?: {
    [key: string]: any;
  }[];
  deletedAt?: null | Date;
};

export default class AbstractController {
  public search(
    request: Request,
    searches: string[],
    filters?: (
      | string
      | {
          col: string;
          input?: string;
          isNumber?: boolean;
          allowed_values?: string[];
          isArray?: boolean;
        }
    )[],
    hasDeletedAt = false
  ): TSearchResponse {
    let response: TSearchResponse = {};

    const _search = request.query.search;

    if (_search) {
      response["$or"] = searches.map((s) => {
        return {
          [s]: { $regex: _search, $options: "i" },
        };
      });
    }

    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (typeof filter === "string") {
          const value = request.query[filter];
          if (value) {
            if (!response["$and"]) response["$and"] = [];
            response["$and"].push({ [filter]: value });
          }
        } else {
          const value = request.query[filter.input || filter.col] as string;
          if (
            value &&
            (!filter.allowed_values || filter.allowed_values.includes(value))
          ) {
            if (filter.isNumber && isNaN(Number(value))) {
              return;
            }
            //here we have an error

            if (filter.isArray) {
              if (mongoose.isValidObjectId(value)) {
                if (!response["$and"]) response["$and"] = [];
                response["$and"].push({
                  [filter.col]: { $elemMatch: { $eq: value } },
                });
              }
            } else {
              if (!response["$and"]) response["$and"] = [];
              response["$and"].push({ [filter.col]: value });
            }
          }
        }
      });
    }

    if (hasDeletedAt) {
      if (!response["$and"]) response["$and"] = [];
      response["$and"].push({ deletedAt: null });
    }

    return response;
  }
  public sort(request: Request, allowed_sorts: string[]): string {
    const _sort = request.query.sort as string | undefined;

    if (!_sort) {
      return "-createdAt";
    }

    let _reformattedSort: string;

    if (_sort.startsWith("-")) {
      _reformattedSort = _sort.slice(1);
      if (!allowed_sorts.includes(_reformattedSort)) {
        return "-createdAt";
      }
      return _sort;
    }

    if (allowed_sorts.includes(_sort)) {
      return _sort;
    }

    return "-createdAt";
  }
}
