import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-12">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <Link href="/" className="flex items-center justify-center">
          <span className="text-2xl font-bold text-orange-500 hover:text-orange-400 transition">
            zocials
          </span>
        </Link>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-400">
          <div className="space-x-6">
            <Link href="/terms" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
          <div>
            <span>© {new Date().getFullYear()} Zocials. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
