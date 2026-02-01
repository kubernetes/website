import { Metadata } from 'next';
import { storeConfig } from '@/config/store';
import { Card, CardContent } from '@/components/ui';
import { ContactForm } from './ContactForm';
import { MessageCircle, Mail, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with the ${storeConfig.siteName} team. We're here to help.`,
};

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-purple-glow opacity-30" />
        <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-purple-glow opacity-20" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Have a question or need assistance? We&apos;re here to help. Send us a message
            and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-white mb-6">
                  Send us a message
                </h2>
                <ContactForm />
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Discord */}
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Discord</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Join our community for fastest support
                    </p>
                    <a
                      href={storeConfig.discordUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
                    >
                      Join Server →
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Email */}
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Email</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      For detailed inquiries
                    </p>
                    <a
                      href={`mailto:${storeConfig.supportEmail}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors break-all"
                    >
                      {storeConfig.supportEmail}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <Card hover>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-1">Response Time</h3>
                    <p className="text-gray-400 text-sm">
                      We typically respond within 24 hours. For urgent issues,
                      please use Discord.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
