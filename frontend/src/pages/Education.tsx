import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { PageProps } from '../pageProps';

const education = [
  {
    degree: 'Bachelor of Technology',
    field: 'Computer Science & Engineering',
    institution: 'Institute of Technology',
    year: '2023 — 2027',
    gpa: '9.1 / 10.0',
    color: '#22d3ee',
    courses: ['Data Structures & Algorithms', 'Machine Learning', 'Computer Vision', 'Web Technologies'],
  },
  {
    degree: 'Higher Secondary Certificate',
    field: 'Science (Physics, Chemistry, Mathematics)', 
    institution: 'Central Academy',
    year: '2021 — 2022',
    gpa: '86%',
    color: '#34d399',
    courses: ['Advanced Mathematics', 'Physics', 'Computer Science', 'English'],
  },
];

export default function Education({ theme }: PageProps) {
  const d = theme === 'day';
  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 py-24" style={{ zIndex: 1 }}>
      <div className="max-w-3xl w-full space-y-12">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-6xl font-thin tracking-[0.3em] text-center"
          style={{ color: d ? 'rgba(38,40,52,0.88)' : 'rgba(255,255,255,0.9)' }}
        >
          EDUCATION
        </motion.h2>

        <div className="relative space-y-6">
          <div
            className="absolute left-8 top-8 bottom-8 w-px"
            style={{
              background: d
                ? 'linear-gradient(to bottom, rgba(55,58,72,0.12), rgba(55,58,72,0.03))'
                : 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03))',
            }}
          />

          {education.map((edu, i) => (
            <motion.div
              key={edu.degree}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 * i }}
              className="relative pl-20"
            >
              <div
                className="absolute left-4 top-6 w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `${edu.color}18`,
                  border: `1px solid ${edu.color}44`,
                  boxShadow: `0 0 16px ${edu.color}22`,
                }}
              >
                <GraduationCap size={14} style={{ color: edu.color }} />
              </div>

              <div
                className="rounded-2xl p-7"
                style={{
                  background: d ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.03)',
                  border: d ? '1px solid rgba(255,255,255,0.65)' : '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(15px) saturate(150%)',
                }}
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-light tracking-wide" style={{ color: d ? 'rgba(32,36,48,0.9)' : 'rgba(255,255,255,0.88)' }}>
                      {edu.degree}
                    </h3>
                    <p className="text-sm mt-0.5" style={{ color: edu.color }}>
                      {edu.field}
                    </p>
                    <p className="text-sm mt-1 font-light" style={{ color: d ? 'rgba(55,58,72,0.55)' : 'rgba(255,255,255,0.45)' }}>
                      {edu.institution}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs tracking-widest" style={{ color: d ? 'rgba(55,58,72,0.42)' : 'rgba(255,255,255,0.35)' }}>
                      {edu.year}
                    </p>
                    <p className="text-sm mt-1 font-light" style={{ color: edu.color }}>
                      {edu.gpa}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {edu.courses.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-0.5 rounded-full text-xs font-light"
                      style={{
                        background: d ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.05)',
                        border: d ? '1px solid rgba(255,255,255,0.75)' : '1px solid rgba(255,255,255,0.1)',
                        color: d ? 'rgba(55,58,72,0.65)' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
