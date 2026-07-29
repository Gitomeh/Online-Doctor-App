import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      {/* Hero Section */}
      <section className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary-100 text-primary-700 text-xs sm:text-sm font-medium dark:bg-primary-900/30 dark:text-primary-300">
              #1 Doctor Appointment Platform
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              Find and Book Doctor Appointments
              <span className="block text-primary-600">Online</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto lg:mx-0">
              Connect with top doctors in your area. Book appointments instantly,
              manage your health records, and get the care you need.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
              <Link href="/booking" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                  Book Appointment
                </Button>
              </Link>
              <Link href="/health-check" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto text-sm sm:text-base">
                  Health Check
                </Button>
              </Link>
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 lg:gap-8 pt-4">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  10K+
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Doctors
                </div>
              </div>
              <div className="w-px h-8 sm:h-12 bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  500K+
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Patients
                </div>
              </div>
              <div className="w-px h-8 sm:h-12 bg-neutral-300 dark:bg-neutral-700"></div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                  4.9
                </div>
                <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
                  Rating
                </div>
              </div>
            </div>
          </div>

          {/* Right: Featured Image */}
          <div className="relative lg:order-2 order-1">
            <div className="relative bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 dark:from-primary-900/20 dark:to-secondary-900/20">
              {/* Decorative elements */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 w-12 h-12 sm:w-20 sm:h-20 bg-primary-200 rounded-full opacity-50 dark:bg-primary-800"></div>
              <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 w-10 h-10 sm:w-16 sm:h-16 bg-secondary-200 rounded-full opacity-50 dark:bg-secondary-800"></div>
              
              {/* Main illustration */}
              <div className="relative z-10 flex flex-col items-center justify-center min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
                <div className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 sm:mb-6 dark:bg-neutral-800">
                  <svg className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-center space-y-1 sm:space-y-2 px-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                    Video Consultations
                  </h3>
                  <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">
                    Connect with doctors from home
                  </p>
                </div>
                
                {/* Floating cards */}
                <div className="absolute top-4 sm:top-8 left-4 sm:left-8 bg-white rounded-lg shadow-md p-2 sm:p-3 lg:p-4 dark:bg-neutral-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        Appointment Booked
                      </div>
                      <div className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
                        Today, 2:00 PM
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 bg-white rounded-lg shadow-md p-2 sm:p-3 lg:p-4 dark:bg-neutral-800">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-medium text-neutral-900 dark:text-neutral-50">
                        24/7 Available
                      </div>
                      <div className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">
                        Emergency support
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - REMOVED (integrated into Quick Actions) */}

      {/* Quick Actions Section */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
            Quick Actions
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Get started with these common actions
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <Link href="/booking" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 shadow-md hover:shadow-lg transition-shadow h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-white">
                Book Appointment
              </h3>
            </div>
          </Link>

          <Link href="/my-appointments" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow dark:bg-neutral-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                My Appointments
              </h3>
            </div>
          </Link>

          <Link href="/my-appointments" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow dark:bg-neutral-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-danger-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-danger-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Cancel Appointment
              </h3>
            </div>
          </Link>

          <Link href="/health-hub" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow dark:bg-neutral-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-success-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Health Hub
              </h3>
            </div>
          </Link>

          <Link href="/doctors/specialties" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow dark:bg-neutral-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-info-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-info-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Doctor Specialties
              </h3>
            </div>
          </Link>

          <Link href="/booking" className="flex-1 min-w-[140px] max-w-[200px]">
            <div className="p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow dark:bg-neutral-800 h-full flex flex-col items-center justify-center text-center">
              <div className="w-10 h-10 rounded-full bg-warning-100 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-warning-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50">
                Reschedule
              </h3>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
