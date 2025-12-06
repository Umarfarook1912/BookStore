import HeroSection from '../components/landing/HeroSection';
import WhySection from '../components/landing/WhySection';
import FeaturesSection from '../components/landing/FeaturesSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import { useEffect } from 'react';

export default function Landing() {
    useEffect(() => {
        // Add scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="landing-page">
            <HeroSection />
            <WhySection />
            <FeaturesSection />
            <CTASection />
            <Footer />
        </div>
    );
}