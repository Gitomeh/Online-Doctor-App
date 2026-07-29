import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MyAppointmentsPage() {
  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              My Appointments
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your scheduled appointments
            </p>
          </div>
          <Link href="/doctors">
            <Button>Book New Appointment</Button>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-neutral-200 dark:border-neutral-700">
          <button className="px-4 py-2 text-primary-600 border-b-2 border-primary-600 font-medium">
            Upcoming
          </button>
          <button className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
            Past
          </button>
          <button className="px-4 py-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50">
            Cancelled
          </button>
        </div>

        {/* Appointment Cards */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md p-6 dark:bg-neutral-800"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex-shrink-0"></div>
                  <div>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                      Dr. Placeholder {i}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      Specialty Placeholder
                    </p>
                    <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-500">
                      <p>📅 January {10 + i}, 2026</p>
                      <p>🕐 10:00 AM</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Reschedule
                  </Button>
                  <Button variant="outline" size="sm" className="text-accent-600 border-accent-600 hover:bg-accent-50">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (hidden when appointments exist) */}
        <div className="hidden text-center py-12">
          <div className="w-24 h-24 rounded-full bg-neutral-200 mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
            No Upcoming Appointments
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            You don't have any scheduled appointments.
          </p>
          <Link href="/doctors">
            <Button>Find a Doctor</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
