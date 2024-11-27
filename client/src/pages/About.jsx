function About() {
  return (
      <div className="bg-green-100 text-gray-800 py-16">
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Meet Our Team</h2>
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
              Bama Charan Chhandogi is taking on the role of DevOps Engineer in this project. As a DevOps Engineer, Bama is responsible for bridging the gap between software development and IT operations. This will involve automating processes, implementing continuous integration/continuous deployment (CI/CD) pipelines.
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
              Chirag is assuming the role of Frontend Engineer in this project. As a Frontend Engineer, Chirag focuses on building and optimizing the user-facing components of the application. This includes designing responsive user interfaces, implementing interactive features, ensuring cross-browser compatibility, and working closely with the design team to deliver an intuitive and visually appealing user experience.
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
              Deepak Kumar is assuming the role of UI/UX Engineer in this project. As a UI/UX Engineer, Deepak focuses on designing user interfaces that are both aesthetically pleasing and functional. Deepak works on improving the overall user experience by conducting user research, creating wireframes, prototyping, and ensuring that the application is intuitive and user-friendly.
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
              <p className="text-gray-500">Backend Engineer</p>
              <p className="mt-2 text-gray-600">
              Bhavik Gaba is assuming the role of Backend Engineer in this project. As a Backend Engineer, Bhavik focuses on developing the server-side logic, database interactions, and APIs that power the application's functionality. Bhavik is responsible for ensuring the performance, security, and scalability of the backend systems.
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