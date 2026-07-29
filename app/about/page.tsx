import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            About DocBook
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Connecting patients with healthcare professionals since 2024
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8 dark:bg-neutral-800">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Our Mission
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
            At DocBook, we believe everyone deserves access to quality healthcare.
            Our platform makes it easy to find, compare, and book appointments with
            qualified doctors in your area. We're committed to simplifying the
            healthcare experience and empowering patients to take control of their
            health journey.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { number: "10,000+", label: "Doctors" },
            { number: "500,000+", label: "Patients" },
            { number: "1M+", label: "Appointments" },
            { number: "50+", label: "Specialties" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-lg shadow-md p-6 text-center dark:bg-neutral-800"
            >
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {stat.number}
              </div>
              <div className="text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-md p-8 dark:bg-neutral-800">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Why Choose DocBook?
            </h2>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Verified and licensed healthcare professionals</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Real-time availability and instant booking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Transparent pricing and insurance information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>Secure and private health records management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-success">✓</span>
                <span>24/7 customer support</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8 dark:bg-neutral-800">
            <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Our Values
            </h2>
            <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span>
                  <strong>Accessibility:</strong> Healthcare should be accessible to
                  everyone
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span>
                  <strong>Transparency:</strong> Clear information about doctors,
                  costs, and availability
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span>
                  <strong>Quality:</strong> Only the best healthcare professionals
                  on our platform
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span>
                  <strong>Innovation:</strong> Continuously improving our platform
                  with technology
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-600">•</span>
                <span>
                  <strong>Compassion:</strong> Understanding and caring for our
                  patients' needs
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-primary-50 rounded-lg p-8 text-center dark:bg-primary-900/20">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Join thousands of patients who trust DocBook for their healthcare
            needs.
          </p>
          <Link href="/booking">
            <Button size="lg">Find a Doctor Now</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
