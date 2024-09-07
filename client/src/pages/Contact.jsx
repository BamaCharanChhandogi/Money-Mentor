import { useState } from "react";

function Contact() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        message: '',
      });
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
          ...form,
          [name]: value,
        });
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Form submitted:', form);
        // Reset form after submission
        setForm({
          name: '',
          email: '',
          message: '',
        });
      };
    return (
        <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          {/* Contact Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-600">
              We’d love to hear from you! Reach out to us with any questions or feedback.
            </p>
          </div>
  
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
  
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>
  
              {/* Message Field */}
              <div className="mt-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  required
                ></textarea>
              </div>
  
              {/* Submit Button */}
              <div className="mt-6 text-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
  
          {/* Contact Details */}
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Phone:</span> (123) 456-7890
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> contact@myfinanceapp.com
            </p>
          </div>
        </div>
      </div>
    );
}

export default Contact;
