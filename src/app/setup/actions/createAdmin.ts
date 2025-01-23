'use server'

import { PrismaClient } from '@prisma/client'
import { SecurePassword } from "@blitzjs/auth/secure-password"
import { revalidatePath } from 'next/cache'
import type { AdminUser } from '../types'

const prisma = new PrismaClient()

export async function createAdmin(data: AdminUser) {
  try {
    const hashedPassword = await SecurePassword.hash(data.password)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        hashedPassword,
        role: 'ADMIN'
      }
    })

    revalidatePath('/setup')
    return { success: true, user }
  } catch (error: any) {
    console.error('Admin creation error:', error)
    return {
      success: false,
      error: error.message || 'Failed to create admin user'
    }
  }
}
