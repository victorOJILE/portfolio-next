'use client';

import { useRef, useState, FormEvent } from 'react';
import { useScrollVisibility } from '@/hooks/useScrollVisibility';
import { trackContactFormSubmit } from '@/lib/firebase/analytics';
import { FaPaperPlane, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: 'idle' | 'loading' | 'success' | 'error';
  message: string;
}

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isVisible = useScrollVisibility(sectionRef);

  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    subject: '',
    message: '',
  });

  const [status, setStatus] = useState<FormStatus>({
    type: 'idle',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Sending...' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        trackContactFormSubmit();
        setStatus({
          type: 'success',
          message: data.message || 'Message sent successfully!',
        });
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          subject: '',
          message: '',
        });

        // Clear success message after 5 seconds
        setTimeout(() => {
          setStatus({ type: 'idle', message: '' });
        }, 5000);
      } else {
        setStatus({
          type: 'error',
          message: data.message || 'Failed to send message. Please try again.',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding bg-dark-300 bg-pattern"
      aria-labelledby="contact-heading">
      <div className="container-custom max-w-4xl">
        {/* Section Heading */}
        <header className={"text-center mb-12 fade-in-up" + (isVisible ? " visible" : "")}>
          <h2 className="section-heading">Contact Me</h2>
        </header>

        {/* Intro Text */}
        <div className={"mb-8 fade-in-up transition-delay-200" + (isVisible ? " visible" : "")}>
          <p className="text-gray-300 text-lg md:text-xl font-crimson text-center">
            I am interested in freelance opportunities. However, if you have other requests or
            questions, don't hesitate to use the form.
          </p>
        </div>

        {/* Contact Form */}
        <div className={"glass-card p-6 md:p-8 fade-in-up transition-delay-400" + (isVisible ? " visible" : "")}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="form-label">
                  Full Name:
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g John Doe"
                  className="form-input"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email: <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@gmail.com"
                  required
                  className="form-input"
                />
              </div>
            </div>

            {/* Subject */}
            <div>
              <label htmlFor="subject" className="form-label">
                Subject:
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g Greetings from John Doe"
                className="form-input"
              />
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="form-label">
                Message: <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Empty your thoughts here. I got you!"
                required
                className="form-textarea"
              />
            </div>

            {/* Status Messages */}
            {status.type !== 'idle' && status.type !== 'loading' && (
              <div className={`p-4 rounded-lg flex items-center gap-3 ${
                  status.type === 'success'
                    ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                    : status.type === 'error'
                    ? 'bg-red-500/20 border border-red-500/50 text-red-300'
                    : 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
                }`}>
                {status.type === 'success' && <FaCheckCircle className="text-2xl" />}
                {status.type === 'error' && <FaExclamationTriangle className="text-2xl" />}
                <span>{status.message}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status.type === 'loading'}
              className="btn-primary w-full md:w-auto min-w-[200px] flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
              {status.type === 'loading' ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
