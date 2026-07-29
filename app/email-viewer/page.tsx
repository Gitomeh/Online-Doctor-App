"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Email {
  to: string;
  subject: string;
  html: string;
  text?: string;
  sentAt: string;
}

export default function EmailViewer() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    // Load emails from localStorage
    try {
      const storedEmails = JSON.parse(localStorage.getItem('sentEmails') || '[]');
      setEmails(storedEmails);
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  }, []);

  const clearEmails = () => {
    localStorage.removeItem('sentEmails');
    setEmails([]);
    setSelectedEmail(null);
  };

  return (
    <div className="flex flex-col flex-1 bg-neutral-50 dark:bg-neutral-900">
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
            Email Viewer (Demo)
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            View emails that were "sent" by the mock email service
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Email List */}
          <Card className="p-6 dark:bg-neutral-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                Sent Emails ({emails.length})
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={clearEmails}
                disabled={emails.length === 0}
              >
                Clear All
              </Button>
            </div>

            {emails.length === 0 ? (
              <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
                No emails sent yet. Sign up or book an appointment to see emails here.
              </p>
            ) : (
              <div className="space-y-3">
                {emails.map((email, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedEmail === email
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                    }`}
                    onClick={() => setSelectedEmail(email)}
                  >
                    <div className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                      {email.subject}
                    </div>
                    <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                      To: {email.to}
                    </div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-500">
                      {new Date(email.sentAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Email Preview */}
          <Card className="p-6 dark:bg-neutral-800">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-4">
              Email Preview
            </h2>

            {!selectedEmail ? (
              <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
                Select an email to preview its content
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Subject:
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {selectedEmail.subject}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    To:
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {selectedEmail.to}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Sent At:
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-50">
                    {new Date(selectedEmail.sentAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Plain Text:
                  </div>
                  <div className="text-neutral-900 dark:text-neutral-50 bg-neutral-100 dark:bg-neutral-700 p-3 rounded text-sm">
                    {selectedEmail.text}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    HTML Preview:
                  </div>
                  <div 
                    className="text-neutral-900 dark:text-neutral-50 bg-white dark:bg-neutral-700 p-3 rounded border border-neutral-200 dark:border-neutral-600"
                    dangerouslySetInnerHTML={{ __html: selectedEmail.html }}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            ⚠️ Mock Email Service
          </h3>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            This is a demonstration email service. No actual emails are sent to real email addresses. 
            In production, you would integrate with a real email service like SendGrid, Mailgun, or AWS SES.
            The emails you see here are stored in your browser's localStorage for demonstration purposes.
          </p>
        </div>
      </main>
    </div>
  );
}