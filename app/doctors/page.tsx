"use client";

import { useState, useEffect } from "react";
import { doctors } from "@/utils/data/doctors";
import { DoctorCardSkeleton } from "@/components/skeletons/doctor-card-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui/optimized-image";

export default function DoctorsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [displayDoctors, setDisplayDoctors] = useState(doctors);

  useEffect(() => {
    // Remove artificial loading delay - load immediately
    setIsLoading(false);
  }, []);

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Find a Doctor
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            Search our directory of qualified healthcare professionals
          </p>
        </div>

        {/* Search Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 dark:bg-neutral-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Specialty
              </label>
              <select className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50">
                <option>All Specialties</option>
                <option>Cardiology</option>
                <option>Dermatology</option>
                <option>General Practice</option>
                <option>Neurology</option>
                <option>Orthopedics</option>
                <option>Pediatrics</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Enter city or zip code"
                className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Availability
              </label>
              <select className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50">
                <option>Any Time</option>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <Button>Search Doctors</Button>
          </div>
        </div>

        {/* Doctor List with Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Doctor listings">
          {isLoading ? (
            // Show skeleton loading
            Array.from({ length: 6 }).map((_, index) => (
              <DoctorCardSkeleton key={index} />
            ))
          ) : (
            // Show actual doctor cards
            doctors.map((doctor, index) => (
            <article key={doctor.id} className="bg-white rounded-lg shadow-md overflow-hidden dark:bg-neutral-800 hover:shadow-lg transition-shadow cursor-pointer h-full">
              <Link href={`/doctors/${doctor.id}`} className="block h-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg">
                <div className="h-48 w-full relative" aria-hidden="true">
                  <OptimizedImage
                    src={doctor.image}
                    alt={`Portrait of ${doctor.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                    {doctor.name}
                  </h3>
                  <p className="text-primary-600 dark:text-primary-400 mb-2">
                    {doctor.specialty}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {doctor.hospital}
                  </p>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {doctor.biography}
                  </p>
                </div>
              </Link>
            </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
