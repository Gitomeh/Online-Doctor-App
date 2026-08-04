"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { initEmailJS, sendEmailViaEmailJS } from "@/lib/emailjs-service";

export default function TestEmailPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    setStatus("Initializing EmailJS...");
    
    try {
      initEmailJS();
      setStatus("Sending test email via EmailJS...");
      
      await sendEmailViaEmailJS({
        to_email: email || "cctomeh@gmail.com",
        to_name: "Test User",
        from_name: "DocBook Test",
        subject: "Test Email from DocBook",
        message: "This is a test email sent via EmailJS configuration."
      });
      
      setStatus(`✅ Success! Email sent via EmailJS to ${email || "cctomeh@gmail.com"}`);
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6">
          Email Test
        </h1>
        
        <Card className="p-6 dark:bg-neutral-800">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Test Email (optional - leave empty to use default)
              </label>
              <Input
                type="email"
                placeholder="Enter email to test"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={testEmail}
              disabled={loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Test Email via EmailJS"}
            </Button>
            
            {status && (
              <div className={`p-4 rounded-lg ${
                status.startsWith('✅') 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100'
              }`}>
                <p className="text-sm">{status}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="mt-6 text-sm text-neutral-600 dark:text-neutral-400">
          <p><strong>EmailJS Configuration:</strong></p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Public Key: YOUR_EMAILJS_PUBLIC_KEY</li>
            <li>Service ID: YOUR_EMAILJS_SERVICE_ID</li>
            <li>Template ID: YOUR_EMAILJS_TEMPLATE_ID</li>
          </ul>
          
          <p className="mt-4"><strong>Doctor Email:</strong> YOUR_DOCTOR_EMAIL@example.com</p>
        </div>
      </div>
    </div>
  );
}
