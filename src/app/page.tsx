'use client'
import { useRouter } from "next/navigation"
import { useEffect } from "react";
import Head from "next/head";
import Script from "next/script";
export default function Home() {

  const toPage = useRouter()

  useEffect(() => {
    toPage.push("/home")
  })

}
