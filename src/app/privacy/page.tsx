import Footer from '@/components/Footer'

export default function Privacy() {
  return (
    <>
      <div className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Information Collection</h2>
            <p>
              We collect information necessary to provide our services, including account details,
              content you post, and usage data. We use cookies and similar technologies to enhance
              your experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Data Usage</h2>
            <p>
              Your data is used to provide and improve our services, personalize your experience,
              and ensure platform security. We do not sell your personal information to third
              parties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Data Protection</h2>
            <p>
              We implement industry-standard security measures to protect your data. However, no
              method of transmission over the internet is 100% secure, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">User Rights</h2>
            <p>
              You can access, update, or delete your personal information at any time through your
              account settings. You may also request a copy of your data or opt-out of certain data
              processing activities.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Updates to Policy</h2>
            <p>
              We may update this privacy policy from time to time. We will notify you of any
              significant changes through our platform or via email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3 text-white">Contact</h2>
            <p>
              For privacy-related inquiries, please contact us at{' '}
              <a href="mailto:privacy@zocials.com" className="text-blue-400 hover:underline">
                privacy@zocials.com
              </a>
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </>
  )
}
