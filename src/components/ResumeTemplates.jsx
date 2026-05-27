import React from 'react';

// Common helper to render common parts if needed
const joinFilters = (arr) => arr.filter(Boolean).join(' • ');

export const TemplateModernATS = ({ data }) => (
    <div className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl rounded-sm font-sans mb-12 origin-top print:shadow-none print:mb-0 print:min-h-0 mx-auto" style={{ minHeight: '1100px' }}>
        <div className="px-12 pt-14 pb-8 border-b-2 border-slate-900 text-center">
            <h1 className="text-4xl font-light tracking-tight text-slate-900 uppercase">
                <span className="font-bold">{(data.name || '').split(' ')[0]}</span> {(data.name || '').split(' ').slice(1).join(' ')}
            </h1>
            <p className="text-sm tracking-widest text-slate-500 uppercase mt-2 font-semibold">{data.role}</p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-medium text-slate-600">
                {joinFilters([data.email, data.phone, data.location]).split(' • ').map((item, i, arr) => (
                    <span key={i} className="flex items-center gap-4">
                        {item} {i < arr.length - 1 && <span className="w-1 h-1 bg-slate-400 rounded-full"></span>}
                    </span>
                ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-1.5 text-xs font-medium text-slate-600">
                {joinFilters([data.linkedin, data.portfolio]).split(' • ').map((item, i, arr) => (
                    <span key={i} className="flex items-center gap-4">
                        {item} {i < arr.length - 1 && <span className="w-1 h-1 bg-slate-400 rounded-full"></span>}
                    </span>
                ))}
            </div>
        </div>
        <div className="px-12 py-8 grid grid-cols-1 gap-8">
            {data.summary && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-2 mb-3">Professional Summary</h2>
                    <p className="text-[13px] leading-relaxed text-slate-700 text-justify">{data.summary}</p>
                </section>
            )}
            {(data.experience || []).length > 0 && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-2 mb-4">Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex items-baseline justify-between mb-1">
                                    <h3 className="text-[14px] font-bold text-slate-900">{exp.role}</h3>
                                    <span className="text-[12px] font-semibold text-slate-500">{exp.duration}</span>
                                </div>
                                <div className="flex items-baseline justify-between mb-2">
                                    <span className="text-[13px] font-medium text-slate-700">{exp.company}</span>
                                    <span className="text-[12px] italic text-slate-500">{exp.location}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-1">
                                    {(Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n')).filter(Boolean).map((point, i) => (
                                        <li key={i} className="text-[13px] leading-relaxed text-slate-700 pl-1">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {/* Education */}
            {(data.education || []).length > 0 && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-2 mb-4">Education</h2>
                    <div className="space-y-4">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="flex items-baseline justify-between">
                                <div>
                                    <h3 className="text-[14px] font-bold text-slate-900">{edu.degree}</h3>
                                    <span className="text-[13px] font-medium text-slate-700">{edu.school}</span>
                                </div>
                                <span className="text-[12px] font-semibold text-slate-500">{edu.duration}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.skills && (
                <section>
                    <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-300 pb-2 mb-3">Skills & Expertise</h2>
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {data.skills.split(',').filter(Boolean).map((skill, i, arr) => (
                            <span key={i} className="text-[13px] text-slate-700 font-medium">
                                {skill.trim()} {i !== arr.length - 1 && <span className="text-slate-300 ml-4">•</span>}
                            </span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

export const TemplateClassic = ({ data }) => (
    <div className="w-full max-w-[850px] bg-white text-black shadow-2xl rounded-sm mb-12 origin-top font-serif print:shadow-none print:mb-0 print:min-h-0 mx-auto" style={{ minHeight: '1100px' }}>
        <div className="px-14 pt-16 pb-6 text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2">{data.name}</h1>
            <div className="text-[13px] mb-3">{data.role}</div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[12px]">
                {joinFilters([data.email, data.phone, data.location]).split(' • ').map((item, i, arr) => (
                    <span key={i}>{item} {i < arr.length - 1 && <span>|</span>}</span>
                ))}
            </div>
            {(data.linkedin || data.portfolio) && (
                <div className="flex flex-wrap items-center justify-center gap-2 text-[12px] mt-1">
                    {joinFilters([data.linkedin, data.portfolio]).split(' • ').map((item, i, arr) => (
                        <span key={i}>{item} {i < arr.length - 1 && <span>|</span>}</span>
                    ))}
                </div>
            )}
        </div>
        <div className="px-14 pb-12 space-y-6">
            {data.summary && (
                <div>
                    <h2 className="text-[14px] font-bold uppercase border-b border-black pb-1 mb-2">Summary</h2>
                    <p className="text-[13px] leading-relaxed text-justify">{data.summary}</p>
                </div>
            )}
            {(data.experience || []).length > 0 && (
                <div>
                    <h2 className="text-[14px] font-bold uppercase border-b border-black pb-1 mb-3">Professional Experience</h2>
                    <div className="space-y-4">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex items-center justify-between font-bold text-[14px]">
                                    <span>{exp.company}{exp.location && `, ${exp.location}`}</span>
                                    <span>{exp.duration}</span>
                                </div>
                                <div className="italic text-[13px] mb-1">{exp.role}</div>
                                <ul className="list-disc list-outside ml-5 space-y-1">
                                    {(Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n')).filter(Boolean).map((point, i) => (
                                        <li key={i} className="text-[13px] leading-relaxed">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {(data.education || []).length > 0 && (
                <div>
                    <h2 className="text-[14px] font-bold uppercase border-b border-black pb-1 mb-3">Education</h2>
                    <div className="space-y-3">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between text-[13px]">
                                <div>
                                    <span className="font-bold">{edu.school}</span>, {edu.degree}
                                </div>
                                <span className="font-bold">{edu.duration}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {data.skills && (
                <div>
                    <h2 className="text-[14px] font-bold uppercase border-b border-black pb-1 mb-3">Skills</h2>
                    <p className="text-[13px] leading-relaxed">
                        <strong>Core Competencies:</strong> {data.skills.split(',').filter(Boolean).map(s => s.trim()).join(', ')}
                    </p>
                </div>
            )}
            {(data.certifications || []).length > 0 && (
                <div>
                    <h2 className="text-[14px] font-bold uppercase border-b border-black pb-1 mb-3">Certifications</h2>
                    <ul className="list-disc list-inside text-[13px] space-y-1">
                        {data.certifications.map((cert, i) => (
                            <li key={i}><strong>{cert.name}</strong> - {cert.issuer} ({cert.date})</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

export const TemplateExecutive = ({ data }) => (
    <div className="w-full max-w-[850px] bg-white text-slate-900 shadow-2xl rounded-sm mb-12 origin-top font-sans print:shadow-none print:mb-0 print:min-h-0 mx-auto" style={{ minHeight: '1100px' }}>
        <div className="px-12 pt-12 text-left bg-slate-100 pb-10 border-b-4 border-slate-800">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 mb-1">{data.name}</h1>
            <p className="text-xl tracking-tight text-slate-600 font-medium mb-4">{data.role}</p>
            <div className="grid grid-cols-2 gap-2 text-[12px] font-semibold text-slate-700 max-w-lg">
                {data.email && <div>E: {data.email}</div>}
                {data.phone && <div>P: {data.phone}</div>}
                {data.location && <div>L: {data.location}</div>}
                {data.linkedin && <div>in: {data.linkedin}</div>}
            </div>
        </div>
        <div className="p-12 space-y-8">
            {data.summary && (
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-2">Executive Summary</h2>
                    <p className="text-[14px] leading-relaxed text-slate-700">{data.summary}</p>
                </section>
            )}
            <div className="w-full h-px bg-slate-300"></div>
            {(data.experience || []).length > 0 && (
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Professional Experience</h2>
                    <div className="space-y-6">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-base font-bold text-slate-800">{exp.role}</h3>
                                        <div className="text-[14px] font-semibold text-slate-600 uppercase tracking-widest">{exp.company}{exp.location && ` | ${exp.location}`}</div>
                                    </div>
                                    <span className="text-[13px] font-bold text-slate-500">{exp.duration}</span>
                                </div>
                                <ul className="list-disc list-outside ml-5 space-y-1.5 mt-2">
                                    {(Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n')).filter(Boolean).map((point, i) => (
                                        <li key={i} className="text-[13px] leading-relaxed text-slate-700">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            <div className="w-full h-px bg-slate-300"></div>
            {(data.education || []).length > 0 && (
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Education & Credentials</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="text-[13px]">
                                <h3 className="font-bold text-slate-800">{edu.degree}</h3>
                                <div className="text-slate-600">{edu.school}</div>
                                <div className="text-slate-500 font-semibold">{edu.duration}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
            {data.skills && (
                <section>
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Core Competencies</h2>
                    <div className="flex flex-wrap gap-2">
                        {data.skills.split(',').filter(Boolean).map((s, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 text-[12px] font-bold rounded">{s.trim()}</span>
                        ))}
                    </div>
                </section>
            )}
        </div>
    </div>
);

export const TemplateTechnical = ({ data }) => (
    <div className="w-full max-w-[850px] bg-white text-slate-800 shadow-2xl rounded-sm mb-12 origin-top font-sans print:shadow-none print:mb-0 print:min-h-0 mx-auto" style={{ minHeight: '1100px' }}>
        <div className="px-10 py-10">
            <div className="flex justify-between items-end border-b-2 border-indigo-600 pb-4 mb-6">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">{data.name}</h1>
                    <div className="text-xl font-medium text-indigo-600 mt-1">{data.role}</div>
                </div>
                <div className="text-right text-[12px] font-mono text-slate-600 space-y-1">
                    <div>{data.email}</div>
                    <div>{data.phone}</div>
                    <div>{data.linkedin}</div>
                    <div>{data.portfolio}</div>
                </div>
            </div>
            {data.summary && (
                <p className="text-[13px] leading-relaxed mb-6 font-medium text-slate-700">{data.summary}</p>
            )}

            {/* Technical Skills emphasized */}
            {data.skills && (
                <div className="mb-6">
                    <h2 className="text-[15px] font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
                        Skills <span className="h-px bg-slate-200 flex-1"></span>
                    </h2>
                    <p className="text-[13px] leading-relaxed font-mono">
                        {data.skills.split(',').filter(Boolean).map(s => s.trim()).join('  |  ')}
                    </p>
                </div>
            )}

            {(data.experience || []).length > 0 && (
                <div className="mb-6">
                    <h2 className="text-[15px] font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Experience <span className="h-px bg-slate-200 flex-1"></span>
                    </h2>
                    <div className="space-y-5">
                        {data.experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-[14px] font-bold text-slate-900">{exp.role} <span className="text-indigo-600">@ {exp.company}</span></h3>
                                    <span className="text-[12px] font-mono text-slate-500">{exp.duration}</span>
                                </div>
                                <ul className="list-disc list-outside ml-5 space-y-1">
                                    {(Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n')).filter(Boolean).map((point, i) => (
                                        <li key={i} className="text-[13px] leading-relaxed text-slate-700">{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects (Specific to Technical template) */}
            {(data.projects || []).length > 0 && (
                <div className="mb-6">
                    <h2 className="text-[15px] font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        Projects <span className="h-px bg-slate-200 flex-1"></span>
                    </h2>
                    <div className="space-y-4">
                        {data.projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-[14px] font-bold text-slate-900">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} className="text-[12px] font-mono text-indigo-500 hover:underline">{proj.link}</a>}
                                </div>
                                <div className="text-[12px] font-mono text-slate-600 mb-1">{proj.tech}</div>
                                <p className="text-[13px] leading-relaxed text-slate-700">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {(data.education || []).length > 0 && (
                <div>
                    <h2 className="text-[15px] font-bold text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2">
                        Education <span className="h-px bg-slate-200 flex-1"></span>
                    </h2>
                    {data.education.map((edu, idx) => (
                        <div key={idx} className="flex justify-between text-[13px] mb-2">
                            <div><strong>{edu.school}</strong> - {edu.degree}</div>
                            <span className="font-mono text-slate-500">{edu.duration}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

export const TemplateMinimalist = ({ data }) => (
    <div className="w-full max-w-[850px] bg-white text-gray-800 shadow-2xl rounded-sm mb-12 origin-top font-sans tracking-wide print:shadow-none print:mb-0 print:min-h-0 mx-auto" style={{ minHeight: '1100px' }}>
        <div className="px-16 py-16">
            <div className="text-center mb-10">
                <h1 className="text-3xl font-medium tracking-widest uppercase text-gray-900 mb-3">{data.name}</h1>
                <p className="text-sm font-light uppercase tracking-[0.2em] text-gray-400 mb-4">{data.role}</p>
                <div className="flex justify-center flex-wrap gap-4 text-[11px] uppercase tracking-wider text-gray-500">
                    {joinFilters([data.email, data.phone, data.location, data.linkedin]).split(' • ').map((item, i) => (
                        <span key={i}>{item}</span>
                    ))}
                </div>
            </div>

            <div className="space-y-10">
                {data.summary && (
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Profile</div>
                        <div className="col-span-3 text-[13px] leading-loose text-gray-600">{data.summary}</div>
                    </div>
                )}
                {(data.experience || []).length > 0 && (
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Experience</div>
                        <div className="col-span-3 space-y-6">
                            {data.experience.map((exp, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-[14px] font-semibold text-gray-900">{exp.role}, {exp.company}</h3>
                                        <span className="text-[11px] text-gray-400 font-medium uppercase">{exp.duration}</span>
                                    </div>
                                    <ul className="list-none space-y-2 mt-2">
                                        {(Array.isArray(exp.points) ? exp.points : (exp.points || '').split('\n')).filter(Boolean).map((point, i) => (
                                            <li key={i} className="text-[13px] leading-loose text-gray-600 relative pl-4 before:content-[''] before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-px before:bg-gray-400">{point}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {(data.education || []).length > 0 && (
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Education</div>
                        <div className="col-span-3 space-y-4">
                            {data.education.map((edu, idx) => (
                                <div key={idx} className="flex justify-between items-baseline">
                                    <div>
                                        <h3 className="text-[13px] font-semibold text-gray-900">{edu.degree}</h3>
                                        <p className="text-[12px] text-gray-500">{edu.school}</p>
                                    </div>
                                    <span className="text-[11px] text-gray-400">{edu.duration}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {data.skills && (
                    <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-1 text-[11px] font-bold uppercase tracking-widest text-gray-400">Skills</div>
                        <div className="col-span-3 text-[13px] leading-loose text-gray-600">
                            {data.skills}
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
);
