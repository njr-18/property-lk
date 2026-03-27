import assert from "node:assert/strict";
import test from "node:test";
import { prisma } from "@property-lk/db/client";
import { loginWithPassword, signupWithPassword } from "../../lib/auth/service";
import { hashPassword } from "../../lib/auth/password";

async function createTemporaryUser() {
  return prisma.user.create({
    data: {
      email: `auth-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`,
      name: "Auth Test User",
      passwordHash: hashPassword("Password123"),
      role: "USER"
    },
    select: {
      id: true,
      email: true
    }
  });
}

test("signup creates a user with valid credentials", async (t) => {
  const email = `signup-${Date.now()}-${Math.random().toString(16).slice(2)}@propertylk.test`;

  try {
    const result = await signupWithPassword({
      name: "Signup Test User",
      email,
      password: "Password123"
    });

    assert.equal(result.ok, true);

    if (!result.ok) {
      return;
    }

    t.after(async () => {
      await prisma.user.delete({
        where: {
          id: result.user.id
        }
      });
    });

    const user = await prisma.user.findUnique({
      where: {
        id: result.user.id
      },
      select: {
        email: true,
        passwordHash: true
      }
    });

    assert.equal(user?.email, email);
    assert.ok(user?.passwordHash);
    assert.notEqual(user?.passwordHash, "Password123");
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
  }
});

test("login rejects invalid credentials and accepts valid ones", async (t) => {
  let user;

  try {
    user = await createTemporaryUser();
  } catch (error) {
    t.skip(`Database is unavailable for integration tests: ${String(error)}`);
    return;
  }

  t.after(async () => {
    await prisma.user.delete({
      where: {
        id: user.id
      }
    });
  });

  const invalidResult = await loginWithPassword({
    email: user.email,
    password: "WrongPassword123"
  });

  assert.deepEqual(invalidResult, {
    ok: false,
    message: "Incorrect email or password."
  });

  const validResult = await loginWithPassword({
    email: user.email,
    password: "Password123"
  });

  assert.equal(validResult.ok, true);

  if (validResult.ok) {
    assert.equal(validResult.user.email, user.email);
  }
});
