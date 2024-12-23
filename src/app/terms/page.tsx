import Footer from '@/components/Footer'

export default function Terms() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Zocials, you agree to be bound by these Terms of Service. If
              you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">2. User Content</h2>
            <p>
              You retain all rights to your content, but grant us a license to use it on our
              platform. You are responsible for the content you post and must not violate any laws
              or rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">3. Account Security</h2>
            <p>
              You are responsible for maintaining the security of your account and password. We
              recommend using a strong, unique password and enabling any additional security
              features we provide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">4. Prohibited Content</h2>
            <p>
              Users must not post content that is illegal, harmful, threatening, abusive, harassing,
              defamatory, or otherwise objectionable. We reserve the right to remove any content
              that violates these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">5. Service Changes</h2>
            <p>
              We reserve the right to modify or discontinue our service at any time. We will make
              reasonable efforts to notify users of significant changes.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
