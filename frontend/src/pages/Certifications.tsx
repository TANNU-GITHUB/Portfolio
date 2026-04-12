import { motion } from 'framer-motion';
import CertificateCard from '../components/CertificateCard';
import type { PageProps } from '../pageProps';

// Import your high-res image files here
import cert1 from '../assets/certificates/cert1.jpg';
import cert2 from '../assets/certificates/cert2.jpg';
import cert3 from '../assets/certificates/cert3.jpg';
import cert4 from '../assets/certificates/cert4.jpg';
import cert5 from '../assets/certificates/cert5.jpg';

const certificates = [
  { id: 'CERT-001', title: 'UI/UX Portfolio Design', image: cert1 },
  { id: 'CERT-002', title: 'Red Hat Certified System Administrator', image: cert2 },
  { id: 'CERT-003', title: 'LNM6.0 participation', image: cert3 },
  { id: 'CERT-004', title: 'Web Development Bootcamp', image: cert4 },
  { id: 'CERT-005', title: 'Computer Vision Bootcamp', image: cert5 },
];

export default function Certifications({ theme }: PageProps) {
  const d = theme === 'day';
  return (
    <div className="relative w-full px-6 py-24" style={{ zIndex: 1 }}>
      <div className="max-w-4xl mx-auto space-y-16">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-6xl font-thin tracking-[0.3em] text-center"
          style={{ color: d ? 'rgba(38,40,52,0.88)' : 'rgba(255,255,255,0.9)' }}
        >
          CERTIFICATIONS
        </motion.h2>

        <div className="relative w-full pb-[30vh]">
          {certificates.map((cert, index) => (
            <CertificateCard
              key={cert.id}
              index={index}
              id={cert.id}
              title={cert.title}
              image={cert.image}
              theme={theme}
            />
          ))}
        </div>
      </div>
    </div>
  );
}