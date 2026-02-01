'use client';

import React, { useState } from 'react';
import { Input, Textarea, Button, useToast } from '@/components/ui';
import { isValidEmail, sanitizeInput } from '@/lib/utils';
import { Send } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { addToast } = useToast();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email),
          message: sanitizeInput(formData.message),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setIsSubmitted(true);
      addToast({
        type: 'success',
        title: 'Message Sent!',
        message: 'We\'ll get back to you soon.',
      });
    } catch (error) {
      console.error('Contact form error:', error);
      addToast({
        type: 'error',
        title: 'Failed to Send',
        message: error instanceof Error ? error.message : 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-400 mb-6">
          Thank you for reaching out. We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          variant="ghost"
          onClick={() => {
            setIsSubmitted(false);
            setFormData({ name: '', email: '', message: '' });
          }}
        >
          Send Another Message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Name"
        name="name"
        placeholder="Your name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        required
      />

      <Textarea
        label="Message"
        name="message"
        placeholder="How can we help you?"
        value={formData.message}
        onChange={handleChange}
        error={errors.message}
        required
        className="min-h-[150px]"
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        rightIcon={<Send className="w-4 h-4" />}
        className="w-full"
      >
        Send Message
      </Button>
    </form>
  );
}

export default ContactForm;
