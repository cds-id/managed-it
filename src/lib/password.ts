import bcrypt from "bcrypt"

const SALT_ROUNDS = 10

export const Password = {
  hash: async (password: string): Promise<string> => {
    return bcrypt.hash(password, SALT_ROUNDS)
  },

  verify: async (hashedPassword: string, plainPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
  },
}
