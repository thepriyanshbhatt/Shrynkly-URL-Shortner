import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Instagram, Linkedin, Github, Twitter, ExternalLink } from 'lucide-react';

export default function About() {
  // Ensure we scroll to the top of the page when the route loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const socialLinks = [
    { icon: <Instagram size={20} />, label: "Instagram", href: "#" },
    { icon: <Linkedin size={20} />, label: "LinkedIn", href: "#" },
    { icon: <Github size={20} />, label: "GitHub", href: "#" },
    { icon: <Twitter size={20} />, label: "X (Twitter)", href: "#" },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -100 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-[#fafafa] dark:bg-[#050505] pt-16 pb-24 px-4 relative z-10 transition-colors duration-300 min-h-[80vh] flex flex-col justify-center items-center"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center w-full gap-12 lg:gap-24">
        
        {/* Left Side: Text Content */}
        <div className="flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          <div className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6 inline-block">
            About Me
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6 text-black dark:text-white">
            Hi! I'm <br className="hidden md:block" />
            <span className="text-blue-600 dark:text-blue-500">Priyansh Bhatt</span>
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl leading-relaxed">
            I'm the creator of Shrynkly. I'm passionate about building clean, high-performance web applications that solve real-world problems. When I'm not coding, I'm usually exploring new design trends or optimizing user experiences.
          </p>

          <a 
            href="https://priiaynsh.framer.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black py-3 px-6 rounded-full font-bold text-sm mb-10 hover:bg-gray-800 dark:hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
          >
            View My Portfolio <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>

          <div className="flex items-center gap-4">
            {socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="w-12 h-12 bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white/30 transition-all hover:scale-110 shadow-sm dark:shadow-none"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="flex-1 w-full max-w-sm md:max-w-none flex justify-center">
          <div className="relative w-full aspect-square md:aspect-auto md:h-[500px] max-w-[400px] rounded-3xl overflow-hidden border-4 border-white dark:border-[#1a1a1a] shadow-2xl bg-gray-100 dark:bg-[#111]">
            <img 
              src="/priyansh.png" 
              alt="Priyansh Bhatt" 
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
