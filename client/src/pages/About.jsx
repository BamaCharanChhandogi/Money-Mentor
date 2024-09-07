function About() {
    return (
        <div className="bg-gray-100 text-gray-800 py-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">About Us</h1>
            <p className="mt-4 text-lg text-gray-600">
              Learn more about our mission, our team, and what drives us to provide the best service for you.
            </p>
          </div>
  
          {/* Mission Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-700">
              At MyFinanceApp, our mission is to empower individuals to take control of their finances. We believe that with the right tools and guidance, everyone can achieve financial independence and security.
            </p>
          </div>
  
          {/* Team Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">Bama Charan Chhandogi</h3>
                <p className="text-gray-500">Devops Engineer</p>
                <p className="mt-2 text-gray-600">
                  John is the visionary behind MyFinanceApp, with a passion for helping people manage their money better.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 1"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">Chirag</h3>
                <p className="text-gray-500">Frontend Engineer</p>
                <p className="mt-2 text-gray-600">
                  John is the visionary behind MyFinanceApp, with a passion for helping people manage their money better.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 3"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">Deepak Kumar</h3>
                <p className="text-gray-500">UI/UX Engineer</p>
                <p className="mt-2 text-gray-600">
                  Emily is responsible for the financial strategy and planning that drives MyFinanceApps success.
                </p>
              </div>
              {/* Team Member 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Team Member 2"
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900">Bhavik Gaba</h3>
                <p className="text-gray-500">Unemployed</p>
                <p className="mt-2 text-gray-600">
                  Jane leads our technology team, ensuring that our app runs smoothly and efficiently for all users.
                </p>
              </div>
            </div>
          </div>
  
          {/* Values Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Value 1 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600">
                  We believe in doing the right thing, always. Integrity is at the core of everything we do.
                </p>
              </div>
  
              {/* Value 2 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We are constantly seeking new ways to improve our services and offer the best possible solutions to our users.
                </p>
              </div>
  
              {/* Value 3 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We are committed to being open and honest in all our interactions with our users, partners, and employees.
                </p>
              </div>
  
              {/* Value 4 */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Customer Focus</h3>
                <p className="text-gray-600">
                  Our users are at the heart of everything we do. We strive to understand their needs and deliver solutions that exceed their expectations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}

export default About;
