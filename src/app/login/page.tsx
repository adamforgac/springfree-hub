"use client"

import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function LoginContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #0088CE 0%, #005a87 100%)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "16px",
          padding: "48px",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          maxWidth: "400px",
          width: "90%",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>🦘</div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            color: "#1a1a1a",
            margin: "0 0 8px 0",
          }}
        >
          Springfree Hub
        </h1>
        <p
          style={{
            color: "#666",
            margin: "0 0 32px 0",
            fontSize: "14px",
          }}
        >
          Business Automation Platform
        </p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              borderRadius: "8px",
              padding: "12px",
              marginBottom: "24px",
              color: "#dc2626",
              fontSize: "14px",
            }}
          >
            {error === "AccessDenied"
              ? "Přístup zamítnut. Tvůj email není na whitelistu."
              : "Chyba při přihlášení. Zkus to znovu."}
          </div>
        )}

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            width: "100%",
            padding: "14px 24px",
            fontSize: "16px",
            fontWeight: "500",
            color: "#1a1a1a",
            background: "white",
            border: "1px solid #e5e5e5",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#f5f5f5"
            e.currentTarget.style.borderColor = "#d5d5d5"
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "white"
            e.currentTarget.style.borderColor = "#e5e5e5"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Přihlásit se přes Google
        </button>

        <p
          style={{
            marginTop: "24px",
            fontSize: "12px",
            color: "#999",
          }}
        >
          Přístup pouze pro autorizované uživatele
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0088CE 0%, #005a87 100%)",
          }}
        >
          <div style={{ color: "white", fontSize: "18px" }}>Načítání...</div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  )
}
