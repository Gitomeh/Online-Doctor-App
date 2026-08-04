"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { doctors as defaultDoctors } from "@/utils/data/doctors";

export default function AdminDoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    specialty: "",
    hospital: "",
    email: "",
    image: "",
    biography: ""
  });

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = () => {
    const stored = localStorage.getItem('doctors');
    if (stored) {
      setDoctors(JSON.parse(stored));
    } else {
      setDoctors(defaultDoctors);
      localStorage.setItem('doctors', JSON.stringify(defaultDoctors));
    }
    setLoading(false);
  };

  const saveDoctors = (updatedDoctors: any[]) => {
    localStorage.setItem('doctors', JSON.stringify(updatedDoctors));
    setDoctors(updatedDoctors);
  };

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialty || !formData.hospital || !formData.email) {
      setMessage("❌ Please fill in all required fields");
      return;
    }

    const newDoctor = {
      id: doctors.length > 0 ? Math.max(...doctors.map(d => d.id)) + 1 : 1,
      ...formData,
      image: formData.image || "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop",
      biography: formData.biography || ""
    };

    const updatedDoctors = [...doctors, newDoctor];
    saveDoctors(updatedDoctors);
    setMessage("✅ Doctor added successfully");
    setShowAddModal(false);
    setFormData({ name: "", specialty: "", hospital: "", email: "", image: "", biography: "" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleEditDoctor = () => {
    if (!formData.name || !formData.specialty || !formData.hospital || !formData.email) {
      setMessage("❌ Please fill in all required fields");
      return;
    }

    const updatedDoctors = doctors.map(d => 
      d.id === selectedDoctor.id ? { ...d, ...formData } : d
    );
    saveDoctors(updatedDoctors);
    setMessage("✅ Doctor updated successfully");
    setShowEditModal(false);
    setSelectedDoctor(null);
    setFormData({ name: "", specialty: "", hospital: "", email: "", image: "", biography: "" });
    setTimeout(() => setMessage(""), 3000);
  };

  const handleDeleteDoctor = (doctorId: number) => {
    if (confirm("Are you sure you want to delete this doctor?")) {
      const updatedDoctors = doctors.filter(d => d.id !== doctorId);
      saveDoctors(updatedDoctors);
      setMessage("✅ Doctor deleted successfully");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const openEditModal = (doctor: any) => {
    setSelectedDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      hospital: doctor.hospital,
      email: doctor.email,
      image: doctor.image,
      biography: doctor.biography
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-neutral-600 dark:text-neutral-400">Loading...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-2">
              Manage Doctors
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Add, edit, and remove healthcare professionals
            </p>
          </div>
          <Button onClick={() => setShowAddModal(true)}>
            Add Doctor
          </Button>
        </div>

        {message && (
          <div className={`mb-4 p-4 rounded-lg ${
            message.startsWith("✅") 
              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" 
              : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
          }`}>
            <p className={`text-sm ${
              message.startsWith("✅") 
                ? "text-green-800 dark:text-green-200" 
                : "text-red-800 dark:text-red-200"
            }`}>
              {message}
            </p>
          </div>
        )}

        {doctors.length === 0 ? (
          <Card className="p-8 dark:bg-neutral-800">
            <p className="text-center text-neutral-600 dark:text-neutral-400">
              No doctors found
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctors.map((doctor) => (
              <Card key={doctor.id} className="p-4 dark:bg-neutral-800">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-200 flex-shrink-0 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 truncate">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-primary-600 dark:text-primary-400 truncate">
                      {doctor.specialty}
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 truncate">
                      {doctor.hospital}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(doctor)}
                    className="flex-1"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push("/admin")}
            className="text-neutral-600 dark:text-neutral-400"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 dark:bg-neutral-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Add New Doctor
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Hospital *
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Biography
                  </label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => setFormData({...formData, biography: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAddDoctor} className="flex-1">
                    Add Doctor
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddModal(false);
                      setFormData({ name: "", specialty: "", hospital: "", email: "", image: "", biography: "" });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Edit Doctor Modal */}
        {showEditModal && selectedDoctor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="p-6 dark:bg-neutral-800 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
                Edit Doctor
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Hospital *
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Biography
                  </label>
                  <textarea
                    value={formData.biography}
                    onChange={(e) => setFormData({...formData, biography: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleEditDoctor} className="flex-1">
                    Save Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowEditModal(false);
                      setSelectedDoctor(null);
                      setFormData({ name: "", specialty: "", hospital: "", email: "", image: "", biography: "" });
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
