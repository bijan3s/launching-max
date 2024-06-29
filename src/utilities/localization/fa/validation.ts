export type LangType = {
  [key: string]: string | undefined;
};

export const faAttributes: LangType = {
  email: "ایمیل",
  password: "رمز عبور",
  role: "نقش",
  username: "نام کاربری",
};

export const faValidations = {
  required: "$attribute الزامی میباشد",
  min: "گزینه $attribute باید حداقل $a کاراکتر باشد.",
  max: "گزینه $attribute باید حداکثر $a کاراکتر باشد.",
  string: "$attribute باید از نوع رشته باشد.",
  int: "$attribute باید از نوع عددی باشد.",
  email: "ایمیل نا معتبر میباشد.",
  unique: "این $attribute از قبل ثبت شده است.",
  exists: "$attribute نا معتبر میباشد",
  enum: "$attribute باید یکی ازاین موارد باشد.",
  mongoID: "$attribute نا معتبر است.",
};
