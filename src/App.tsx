/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { A11yAnnouncerProvider } from './components/A11yAnnouncer';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Blog } from './components/Blog';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ReadingProgressBar } from './components/ReadingProgressBar';

export default function App() {
  // Theme state: dark mode handling with persistence & system preference
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('jhonatan_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('jhonatan_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('jhonatan_theme', 'light');
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  // ScrollSpy with IntersectionObserver to track active section
  useEffect(() => {
    const sectionIds = ['inicio', 'sobre-mi', 'proyectos', 'blog', 'contacto'];
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  return (
    <A11yAnnouncerProvider>
      <div className="min-h-screen bg-white text-[#111111] dark:bg-[#0A0A0A] dark:text-[#F3F4F6] transition-colors duration-200 flex flex-col font-sans">
        
        {/* Reading Progress Indicator at top of screen */}
        <ReadingProgressBar />

        {/* Fixed Header */}
        <Header
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          activeSection={activeSection}
        />

        {/* Semantic Main landmark targeting skip-to-content */}
        <main id="main-content" tabIndex={-1} className="focus:outline-none flex-1">
          <Hero />
          <About />
          <Projects />
          <Blog />
          <Contact />
        </main>

        {/* Semantic Footer with Admin Entry Point */}
        <Footer onOpenAdmin={() => setIsAdminModalOpen(true)} />

        {/* Discrete Floating WhatsApp Button */}
        <FloatingWhatsApp />

        {/* Administrative Dashboard Modal */}
        <AdminPanelModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
        />
        
      </div>
    </A11yAnnouncerProvider>
  );
}
