import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Code2, Layout, Zap, Smartphone, Mail } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaGithub, FaXTwitter } from 'react-icons/fa6';

export default function About() {
  // Ensure we scroll to the top of the page when the route loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const skills = [
    { icon: <Code2 size={24} />, title: "Web Architecture", desc: "Building scalable, high-performance backends." },
    { icon: <Layout size={24} />, title: "UI/UX Engineering", desc: "Crafting pixel-perfect, intuitive interfaces." },
    { icon: <Zap size={24} />, title: "Optimization", desc: "Maximizing speed and seamless interactions." },
    { icon: <Smartphone size={24} />, title: "Cross-Platform", desc: "Ensuring flawless functionality everywhere." }
  ];

  const socialLinks = [
    { icon: <Mail size={24} />, label: "Email", handle: "hello@shrynkly.com", href: "mailto:hello@shrynkly.com" },
    { icon: <FaLinkedin size={24} />, label: "LinkedIn", handle: "linkedin.com/in/priyanshbhatt", href: "#" },
    { icon: <FaGithub size={24} />, label: "GitHub", handle: "github.com/priyanshbhatt", href: "#" },
    { icon: <FaXTwitter size={24} />, label: "X (Twitter)", handle: "x.com/priyanshbhatt", href: "#" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#fafafa] dark:bg-[#050505] pt-16 pb-32 px-4 relative z-10 transition-colors duration-300 min-h-screen flex flex-col items-center"
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col gap-32">
        
        {/* 1. Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left Side: Image */}
          <div className="w-full md:w-5/12 flex justify-center relative">
            <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-gray-200 dark:bg-[#111] shadow-2xl border border-gray-200 dark:border-white/10">
              <img 
                src="/priyansh.png" 
                alt="Priyansh Bhatt" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
              {/* Badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest px-6 py-2.5 rounded-full whitespace-nowrap shadow-xl">
                Founder & Creator
              </div>
            </div>
          </div>

          {/* Right Side: Text */}
          <div className="w-full md:w-7/12 text-center md:text-left flex flex-col items-center md:items-start">
            <div className="bg-gray-200 dark:bg-white/10 text-gray-800 dark:text-gray-300 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block">
              About the Builder
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 text-black dark:text-white leading-[1.1]">
              Hi, I'm <br className="hidden md:block" />
              <span className="text-gray-500 dark:text-gray-400">Priyansh Bhatt</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-xl leading-relaxed">
              I am a passionate software engineer and the creator of Shrynkly. My expertise lies in building dynamic, highly-optimized web applications that solve complex problems with elegant, minimalist design. 
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 w-full">
              <a 
                href="https://priiaynsh.framer.ai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-4 px-8 rounded-full font-bold text-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-md flex-1 sm:flex-none"
              >
                View Portfolio <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
              <a 
                href="mailto:hello@shrynkly.com" 
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-black dark:border-white text-black dark:text-white py-4 px-8 rounded-full font-bold text-sm hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-105 active:scale-95 flex-1 sm:flex-none"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        {/* 2. What I Do Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white mb-12 text-center">What I Do</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-3xl p-8 hover:shadow-2xl dark:hover:shadow-none hover:border-gray-400 dark:hover:border-white/30 transition-all duration-300 hover:-translate-y-2 group">
                <div className="w-14 h-14 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-black dark:text-white mb-8 group-hover:scale-110 transition-transform duration-300">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-black text-black dark:text-white mb-3">{skill.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{skill.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. The Quote Block */}
        <div className="w-full bg-black dark:bg-[#111] rounded-[3rem] p-12 lg:p-24 text-center shadow-2xl relative overflow-hidden border border-black dark:border-white/10">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
            <p className="text-2xl md:text-3xl lg:text-5xl font-medium text-white leading-[1.3] mb-10 tracking-tight">
              "I love the challenge of coding and design, focusing on creating seamless user experiences across all platforms."
            </p>
            <div className="flex items-center gap-4 text-gray-400 font-medium tracking-wide text-sm uppercase">
              <span className="w-12 h-[1px] bg-gray-600"></span>
              My Development Philosophy
            </div>
          </div>
        </div>

        {/* 4. Let's Connect Section */}
        <div className="flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white mb-12 text-center">Let's Connect</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
            {socialLinks.map((link, index) => (
              <a 
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-white/10 rounded-[2rem] p-6 flex items-center justify-between hover:shadow-xl dark:hover:shadow-none hover:border-black dark:hover:border-white/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-gray-100 dark:bg-[#1a1a1a] rounded-2xl flex items-center justify-center text-gray-800 dark:text-gray-200 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors duration-300">
                    {link.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black dark:text-white mb-1">{link.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{link.handle}</p>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:bg-black group-hover:border-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:border-white dark:group-hover:text-black transition-all duration-300">
                  <ExternalLink size={16} />
                </div>
              </a>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
