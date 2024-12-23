import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex flex-col md:flex-row items-center justify-center gap-8 p-8">
      <div className="flex-1 max-w-md">
        <div className="text-center md:text-left mb-8">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">zocials</h1>
          <p className="text-xl text-gray-200">
            Share and discover amazing short videos with friends around the world.
          </p>
        </div>
      </div>

      <div className="flex-1 max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 shadow-2xl border border-white/20">
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full bg-orange-600 text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-orange-700 transition duration-300"
            >
              Log In
            </Link>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-gray-300">or</span>
              </div>
            </div>

            <Link
              href="/register"
              className="block w-full bg-purple-500/20 backdrop-blur-sm text-white py-3 px-4 rounded-lg text-center font-semibold hover:bg-purple-600/30 transition duration-300 border border-purple-500/30"
            >
              Create New Account
            </Link>
          </div>

          <div className="mt-8 text-center text-sm text-gray-300">
            <p>Join millions of users sharing their moments.</p>
            <p className="mt-2">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="text-orange-400 hover:text-orange-300 transition">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-orange-400 hover:text-orange-300 transition">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
