import Navigation from '@/components/Navigation'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="pt-16 min-h-screen bg-black">{children}</main>
    </>
  )
}
