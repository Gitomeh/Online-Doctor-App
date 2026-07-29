import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
    email: string;
    biography: string;
  };
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full bg-neutral-100 dark:bg-neutral-800">
          <Image
            src={doctor.image}
            alt={doctor.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold text-neutral-900 dark:text-neutral-50">
              {doctor.name}
            </h3>
            <p className="text-primary-600 dark:text-primary-400 font-medium">
              {doctor.specialty}
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <svg
              className="w-4 h-4 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="truncate">{doctor.hospital}</span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-3">
            {doctor.biography}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-6 pt-0 flex flex-col sm:flex-row gap-3">
        <Link href={`/doctors/${doctor.id}`} className="flex-1">
          <Button variant="outline" className="w-full">
            View Profile
          </Button>
        </Link>
        <Link href={`/booking/${doctor.id}`} className="flex-1">
          <Button className="w-full">Book Appointment</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
