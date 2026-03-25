import { Target, Lightbulb, Shield, Users, Heart, Zap, Award, Globe } from 'lucide-react';

function About() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We believe in doing the right thing, always. Integrity is at the core of everything we do.",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly seek new ways to improve our services and offer the best possible solutions to our users.",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Globe,
      title: "Transparency",
      description: "We are committed to being open and honest in all our interactions with users, partners, and employees.",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Our users are at the heart of everything we do. We strive to exceed their expectations.",
      gradient: "from-rose-500 to-rose-600"
    }
  ];

  return (
    <div className="min-h-screen bg-mesh py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 fade-in-up">
          <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-2xl mb-6">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
            <span className="gradient-text-ocean">About Money Mentor</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Empowering individuals to take control of their financial future through innovative technology and personalized guidance
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20 fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="glass-card p-12 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center space-x-4 mb-6">
                <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-900">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed max-w-4xl">
                At Money Mentor, our mission is to democratize financial wellness. We believe that with the right tools, insights, and guidance, everyone can achieve financial independence and security. Our platform combines cutting-edge AI technology with intuitive design to make personal finance management accessible, understandable, and actionable for everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="glass-card p-8 hover:shadow-2xl transition-all duration-500 group"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 p-4 rounded-2xl bg-gradient-to-br ${value.gradient} group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{value.title}</h3>
                      <p className="text-slate-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 fade-in-up" style={{ animationDelay: '0.4s' }}>
          {[
            { icon: Users, value: "10K+", label: "Active Users" },
            { icon: Zap, value: "50K+", label: "Transactions Tracked" },
            { icon: Award, value: "98%", label: "User Satisfaction" },
            { icon: Globe, value: "15+", label: "Countries" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="text-center glass-card p-6 hover:shadow-xl transition-all duration-300">
                <div className="inline-flex p-3 bg-primary-100 rounded-xl mb-3">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default About;