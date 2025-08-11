'use client'

import Contact from '@/components/cantact';
import DashboardNavbar from '@/components/dashboardNavbar';
import Features from '@/components/Features';
import Hero from '@/components/hero';
import Pricing from '@/components/pricing';
import Stats from '@/components/stats';
import WebsiteFooter from '@/components/websiteFooter';
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter()
  return (
    <div className='relative'>
      <DashboardNavbar />
      <Hero />
      <Features />
      <Stats />
      <Pricing />
      <Contact />
      <WebsiteFooter />
    </div>
  )
}
