"use client"

import { Suspense } from "react"
import SignInForm from "./SignInForm"

interface PageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function SignInPage({ searchParams }: PageProps) {
  return <SignInForm searchParams={searchParams} />
} 