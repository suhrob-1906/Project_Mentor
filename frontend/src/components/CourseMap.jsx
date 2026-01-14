import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Star, Play, Flag, BookOpen, Code2, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseMap = ({ course, activeLesson, onSelectLesson, isCompact = false }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    if (!course) return null;

    // Flatten all lessons into a single list for easier path drawing
    const allLessons = course.modules.flatMap(m => m.lessons);

    // Configuration for the wavy path
    const curveWidth = isCompact ? 60 : 120; // How wide the wave goes left/right
    const stepHeight = isCompact ? 100 : 160; // Vertical distance between lessons
    const startY = 50; // Top padding

    // Helper to calculate position of a lesson node
    const getPosition = (index) => {
        const row = Math.floor(index / 2);
        const isPractice = index % 2 === 1;

        // Wavy logic: x oscillates based on row
        const waveOffset = Math.sin(row * 0.8) * 40;
        const columnX = isPractice ? curveWidth : -curveWidth;

        const x = columnX + waveOffset;
        const y = startY + (row * stepHeight);

        return { x, y };
    };

    const generatePaths = () => {
        let theoryPath = "";
        let practicePath = "";

        const numRows = Math.ceil(allLessons.length / 2);

        for (let i = 0; i < numRows; i++) {
            const theoryPos = getPosition(i * 2);
            const practicePos = getPosition(i * 2 + 1 || i * 2); // Fallback for last node if odd

            if (i === 0) {
                theoryPath += `M ${theoryPos.x + 400} ${theoryPos.y}`;
                practicePath += `M ${practicePos.x + 400} ${practicePos.y}`;
            } else {
                // Curved segments
                const prevTheoryPos = getPosition((i - 1) * 2);
                const prevPracticePos = getPosition((i - 1) * 2 + 1);

                theoryPath += ` C ${prevTheoryPos.x + 400} ${prevTheoryPos.y + stepHeight / 2}, ${theoryPos.x + 400} ${theoryPos.y - stepHeight / 2}, ${theoryPos.x + 400} ${theoryPos.y}`;
                practicePath += ` C ${prevPracticePos.x + 400} ${prevPracticePos.y + stepHeight / 2}, ${practicePos.x + 400} ${practicePos.y - stepHeight / 2}, ${practicePos.x + 400} ${practicePos.y}`;
            }
        }
        return { theoryPath, practicePath };
    };

    const { theoryPath, practicePath } = generatePaths();

    return (
        <div className={`flex flex-col items-center py-10 w-full mx-auto relative min-h-screen ${isCompact ? 'scale-90 origin-top' : 'max-w-2xl'}`}>
            {!isCompact && (
                <header className="text-center mb-16 z-10 relative">
                    <div className="inline-block bg-yellow-400 p-4 rounded-3xl rotate-3 shadow-xl mb-4 cursor-default transition hover:rotate-6 hover:scale-110 border-4 border-black">
                        <Star className="w-10 h-10 text-yellow-900 fill-current" />
                    </div>
                    <h2 className="text-4xl font-black text-gray-800 tracking-tight">{course.title}</h2>
                    <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">{course.description}</p>
                </header>
            )}

            {/* Column Headers */}
            {!isCompact && (
                <div className="w-full flex justify-between absolute top-[280px] px-24 pointer-events-none opacity-20">
                    <div className="text-xl font-black uppercase tracking-tighter text-indigo-900 flex flex-col items-center gap-2">
                        <BookOpen className="w-8 h-8" /> {t('roadmap.theory')}
                    </div>
                    <div className="text-xl font-black uppercase tracking-tighter text-purple-900 flex flex-col items-center gap-2">
                        <Code2 className="w-8 h-8" /> {t('roadmap.practice')}
                    </div>
                </div>
            )}

            <div className="relative w-full flex justify-center" style={{ height: `${allLessons.length * stepHeight / 2 + 200}px` }}>

                {/* 1. SVG Path (Background) */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="theoryGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
                        </linearGradient>
                        <linearGradient id="practiceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.2" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>
                    <g transform="translate(-400, 50)">
                        <path
                            d={theoryPath}
                            fill="none"
                            stroke="url(#theoryGradient)"
                            strokeWidth={isCompact ? "8" : "16"}
                            strokeLinecap="round"
                            strokeDasharray="1, 20"
                            className="transition-all duration-1000"
                        />
                        <path
                            d={practicePath}
                            fill="none"
                            stroke="url(#practiceGradient)"
                            strokeWidth={isCompact ? "8" : "16"}
                            strokeLinecap="round"
                            strokeDasharray="1, 20"
                            className="transition-all duration-1000"
                        />
                    </g>
                </svg>

                {/* 2. Lessons Nodes */}
                {allLessons.map((lesson, globalIndex) => {
                    const pos = getPosition(globalIndex);
                    const isLocked = !lesson.is_unlocked;
                    const isCompleted = lesson.is_completed;
                    const isActive = activeLesson?.slug === lesson.slug;

                    // Button Colors
                    let bgColor = "bg-gray-200";
                    let borderColor = "border-gray-300";
                    let iconColor = "text-gray-400";
                    let glowClass = "";

                    if (!isLocked) {
                        if (isCompleted) {
                            bgColor = "bg-yellow-400";
                            borderColor = "border-yellow-600";
                            iconColor = "text-yellow-900";
                        } else {
                            const isTheory = lesson.lesson_type === 'theory';
                            bgColor = isTheory ? "bg-indigo-500 hover:bg-indigo-400" : "bg-purple-500 hover:bg-purple-400";
                            borderColor = isTheory ? "border-indigo-700" : "border-purple-700";
                            iconColor = "text-white";
                            if (isActive) glowClass = isTheory ? "shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)]" : "shadow-[0_0_30px_-5px_rgba(168,85,247,0.6)]";
                        }
                    }

                    const size = isCompact ? "w-14 h-14" : "w-20 h-20";

                    return (
                        <div
                            key={lesson.slug}
                            className="absolute flex flex-col items-center group z-10"
                            style={{
                                top: `${pos.y + 50}px`,
                                left: `50%`,
                                transform: `translateX(${pos.x}px) translateX(-50%)`
                            }}
                        >
                            {/* Floating Module Title */}
                            {globalIndex % 2 === 0 && !isCompact && (
                                <div className="absolute -top-14 bg-white/80 backdrop-blur-md border-2 border-gray-100 px-5 py-1.5 rounded-2xl shadow-sm whitespace-nowrap z-0 transition-transform hover:-translate-y-1">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                                        {(() => {
                                            const mod = course.modules.find(m => m.lessons.some(l => l.slug === lesson.slug));
                                            const title = (i18n.language || 'en').startsWith('ru') ? mod?.title_ru : mod?.title_en;
                                            return title || t('roadmap.module');
                                        })()}
                                    </span>
                                </div>
                            )}

                            <button
                                onClick={() => !isLocked && onSelectLesson(lesson.slug)}
                                disabled={isLocked}
                                className={`
                                    ${size} rounded-[2rem] flex items-center justify-center 
                                    border-b-[6px] transition-all duration-150 relative
                                    ${bgColor} ${borderColor} ${glowClass}
                                    ${isActive ? 'ring-8 ring-white/30 scale-110 z-20' : 'hover:scale-105 active:scale-95'}
                                    ${isLocked ? 'grayscale opacity-60' : ''}
                                `}
                            >
                                <div className="absolute top-2 left-2 w-full h-full rounded-[1.8rem] border-t-4 border-white opacity-20 pointer-events-none"></div>

                                {isCompleted ? (
                                    <Check className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} stroke-[4] ${iconColor}`} />
                                ) : isLocked ? (
                                    <Lock className={`${isCompact ? 'w-5 h-5' : 'w-7 h-7'} ${iconColor}`} />
                                ) : (
                                    lesson.lesson_type === 'theory' ? (
                                        <BookOpen className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} fill-current ${iconColor}`} />
                                    ) : (
                                        <Code2 className={`${isCompact ? 'w-6 h-6' : 'w-8 h-8'} fill-current ${iconColor}`} />
                                    )
                                )}
                            </button>

                            {/* Label for non-compact */}
                            {!isCompact && (
                                <div className="absolute top-24 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none z-30">
                                    <div className="bg-gray-900/90 backdrop-blur-sm text-white text-[10px] font-black py-2 px-4 rounded-xl shadow-2xl whitespace-nowrap uppercase tracking-widest border border-white/10">
                                        {lesson.title}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {!isCompact && (
                    <div className="absolute text-gray-300 font-black uppercase text-[10px] tracking-[0.3em] flex flex-col items-center gap-3"
                        style={{ top: '60px', left: '50%', transform: 'translateX(-50%)' }}>
                        <div className="p-3 bg-white border-2 border-dashed border-gray-100 rounded-full">
                            <Flag className="w-5 h-5" />
                        </div>
                        {t('roadmap.start')}
                    </div>
                )}

            </div>

            {!isCompact && (
                <div className="h-40 text-center text-gray-300 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                    {allLessons.every(l => l.is_completed) ? (
                        <button
                            onClick={() => navigate(`/courses/${course.slug}/completion`)}
                            className="px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-yellow-900 font-black rounded-[2rem] shadow-2xl shadow-yellow-200/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 border-b-8 border-yellow-700 active:border-b-0 animate-bounce-slow"
                        >
                            <Award className="w-6 h-6" />
                            {t('roadmap.claim_reward')}
                        </button>
                    ) : (
                        <div className="opacity-40 flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            {t('roadmap.keep_going')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CourseMap;
