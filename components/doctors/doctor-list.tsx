"use client";

import { useState } from "react";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DoctorListProps {
  doctors: any[];
}

export function DoctorList({ doctors }: DoctorListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");

  // Extract unique specialties
  const specialties = ["All", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty)))];

  const filteredDoctors = doctors.filter((doctor) => {
    // Filter by specialty
    const matchesSpecialty =
      selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;

    // Filter by search query
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.hospital.toLowerCase().includes(query);

    return matchesSpecialty && matchesSearch;
  });

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name, specialty, or hospital..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Specialty Filter Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialty === specialty ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedSpecialty(specialty)}
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Info */}
      {(searchQuery || selectedSpecialty !== "All") && (
        <div className="mb-6">
          {filteredDoctors.length === 0 ? (
            <p className="text-neutral-600 dark:text-neutral-400">
              No doctors found matching your criteria
            </p>
          ) : (
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Showing {filteredDoctors.length} of {doctors.length} doctors
              {selectedSpecialty !== "All" && ` in ${selectedSpecialty}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </p>
          )}
        </div>
      )}

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
