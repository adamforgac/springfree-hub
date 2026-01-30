import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// Whitelist of allowed email addresses
// Add more emails separated by commas in the environment variable
const getAllowedEmails = (): string[] => {
  const emails = process.env.ALLOWED_EMAILS || ""
  return emails.split(",").map(email => email.trim().toLowerCase()).filter(Boolean)
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = getAllowedEmails()

      // If no whitelist configured, deny all (safety first)
      if (allowedEmails.length === 0) {
        console.error("No ALLOWED_EMAILS configured - denying access")
        return false
      }

      const userEmail = user.email?.toLowerCase()
      if (!userEmail || !allowedEmails.includes(userEmail)) {
        console.warn(`Access denied for email: ${userEmail}`)
        return false
      }

      return true
    },
    async session({ session }) {
      return session
    },
  },
})
