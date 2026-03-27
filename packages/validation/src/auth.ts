const MIN_PASSWORD_LENGTH = 8;
const MAX_NAME_LENGTH = 80;

export type AuthFieldError = {
  field: "name" | "email" | "password";
  message: string;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type SignupInput = LoginInput & {
  name?: string;
};

export type AuthValidationResult<TData> = {
  ok: boolean;
  data?: TData;
  errors: AuthFieldError[];
};

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeName(name: string | undefined) {
  const normalized = name?.trim().replace(/\s+/g, " ");
  return normalized ? normalized : undefined;
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(email));
}

export function validatePassword(password: string) {
  return password.trim().length >= MIN_PASSWORD_LENGTH;
}

export function parseLoginInput(input: Partial<LoginInput>): AuthValidationResult<LoginInput> {
  const errors: AuthFieldError[] = [];
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";

  if (!validateEmail(email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address."
    });
  }

  if (!password) {
    errors.push({
      field: "password",
      message: "Enter your password."
    });
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      email,
      password
    },
    errors
  };
}

export function parseSignupInput(input: Partial<SignupInput>): AuthValidationResult<SignupInput> {
  const errors: AuthFieldError[] = [];
  const name = normalizeName(input.name);
  const email = normalizeEmail(input.email ?? "");
  const password = input.password ?? "";

  if (name && name.length > MAX_NAME_LENGTH) {
    errors.push({
      field: "name",
      message: "Name must be 80 characters or fewer."
    });
  }

  if (!validateEmail(email)) {
    errors.push({
      field: "email",
      message: "Enter a valid email address."
    });
  }

  if (!validatePassword(password)) {
    errors.push({
      field: "password",
      message: "Password must be at least 8 characters."
    });
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors
    };
  }

  return {
    ok: true,
    data: {
      name,
      email,
      password
    },
    errors
  };
}
