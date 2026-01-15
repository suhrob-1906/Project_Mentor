import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Lock, Star, Play, Flag, BookOpen, Code2, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CourseMap = ({ course, activeLesson, onSelectLesson, isCompact = false }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    if (!course) return null;

    // Separate theory and practice lessons
    const theoryLessons = [];
    const practiceLessons = [];

    course.modules.forEach(m => {
        m.lessons.forEach(l => {
            if (l.lesson_type === 'theory') theoryLessons.push(l);
            else practiceLessons.push(l);
        });
    });

    const maxLessons = Math.max(theoryLessons.length, practiceLessons.length);
    const stepHeight = isCompact ? 100 : 180;

    // SVG Paths for Two Branches (ZigZag or Parallel)
    // We'll use two parallel vertical wavy paths
    const generatePath = (isRight) => {
        let path = "";
        const xOffset = isRight ? 100 : -100; // Distance from center
        const waveAmp = 20; // Amplitude of wiggle

        path += `M ${400 + xOffset} 50 `; // Start

        for (let i = 0; i < maxLessons; i++) {
            const y = 50 + (i * stepHeight);
            const nextY = 50 + ((i + 1) * stepHeight);

            // Simple wave
            const c1y = y + stepHeight * 0.5;
            const c2y = y + stepHeight * 0.5;
            const wx = (i % 2 === 0 ? waveAmp : -waveAmp);

            path += `C ${400 + xOffset + wx} ${c1y}, ${400 + xOffset - wx} ${c2y}, ${400 + xOffset} ${nextY} `;
        }
        return path;
    };

    const theoryPath = generatePath(false);
    const practicePath = generatePath(true);

    return (
        <div className={`relative w-full mx-auto min-h-screen flex flex-col items-center ${isCompact ? 'scale-90 origin-top' : ''}`} style={{ maxWidth: '800px' }}>

            {/* Header / Start */}
            {!isCompact && (
                <div className="flex flex-col items-center mb-10 z-20">
                    <div className="bg-yellow-400 p-4 rounded-3xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rotate-3 hover:rotate-6 transition-transform">
                        <Star className="w-12 h-12 text-yellow-900 fill-current" />
                    </div>
                    <h1 className="text-4xl font-black mt-6 text-center text-gray-900 uppercase tracking-tighter">
                        {course.title}
                    </h1>
                </div>
            )}

            {/* Two Columns Layout Headers */}
            {!isCompact && (
                <div className="w-full flex justify-between px-10 mb-10 z-20 pointer-events-none">
                    <div className="flex flex-col items-center">
                        <div className="bg-indigo-100 p-3 rounded-2xl mb-2 border-2 border-indigo-200">
                            <BookOpen className="w-8 h-8 text-indigo-600" />
                        </div>
                        <span className="font-black text-indigo-900 uppercase tracking-widest text-xs">Theory Path</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="bg-purple-100 p-3 rounded-2xl mb-2 border-2 border-purple-200">
                            <Code2 className="w-8 h-8 text-purple-600" />
                        </div>
                        <span className="font-black text-purple-900 uppercase tracking-widest text-xs">Practice Path</span>
                    </div>
                </div>
            )}

            {/* Scrollable Map Area */}
            <div className="relative w-full" style={{ height: `${maxLessons * stepHeight + 200}px` }}>

                {/* SVG Background Lines */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="theoryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.1" />
                        </linearGradient>
                        <linearGradient id="practiceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.1" />
                        </linearGradient>
                    </defs>

                    {/* Centered coordinate system, assuming container width ~800px, center is 400 */}
                    <path d={theoryPath} fill="none" stroke="url(#theoryGrad)" strokeWidth="24" strokeLinecap="round" transform="translate(0, 50)" />
                    <path d={theoryPath} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="10, 20" transform="translate(0, 50)" />

                    <path d={practicePath} fill="none" stroke="url(#practiceGrad)" strokeWidth="24" strokeLinecap="round" transform="translate(0, 50)" />
                    <path d={practicePath} fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeDasharray="10, 20" transform="translate(0, 50)" />
                </svg>

                {/* Nodes */}
                {[...Array(maxLessons)].map((_, i) => {
                    const tLesson = theoryLessons[i];
                    const pLesson = practiceLessons[i];

                    const yPos = 100 + (i * stepHeight);

                    return (
                        <React.Fragment key={i}>
                            {/* Theory Node (Left) */}
                            {tLesson && (
                                <LessonNode
                                    lesson={tLesson}
                                    activeLesson={activeLesson}
                                    onSelect={onSelectLesson}
                                    x={400 - 100} // Center - 100
                                    y={yPos}
                                    type="theory"
                                    compact={isCompact}
                                />
                            )}

                            {/* Practice Node (Right) */}
                            {pLesson && (
                                <LessonNode
                                    lesson={pLesson}
                                    activeLesson={activeLesson}
                                    onSelect={onSelectLesson}
                                    x={400 + 100} // Center + 100
                                    y={yPos}
                                    type="practice"
                                    compact={isCompact}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

// Sub-component for individual nodes to keep main cleaner
const LessonNode = ({ lesson, activeLesson, onSelect, x, y, type, compact }) => {
    const isLocked = !lesson.is_unlocked;
    const isCompleted = lesson.is_completed;
    const isActive = activeLesson?.slug === lesson.slug;

    // Styles based on type
    const colorClass = type === 'theory'
        ? "bg-indigo-500 border-indigo-700 shadow-indigo-200"
        : "bg-purple-500 border-purple-700 shadow-purple-200";

    const completedClass = "bg-yellow-400 border-yellow-600 shadow-yellow-200";

    const finalBg = isCompleted ? completedClass : (isLocked ? "bg-gray-200 border-gray-300" : colorClass);

    const size = compact ? "w-14 h-14" : "w-20 h-20";

    return (
        <div
            className="absolute flex flex-col items-center group z-10 hover:z-20"
            style={{
                left: `${x}px`,
                top: `${y}px`,
                transform: 'translate(-50%, -50%)'
            }}
        >
            {/* Tooltip Title */}
            {!compact && (
                <div className={`
                    absolute -top-12 opacity-0 group-hover:opacity-100 transition-all duration-300
                    bg-gray-900 text-white text-[10px] font-bold py-2 px-3 rounded-xl whitespace-nowrap
                    pointer-events-none transform translate-y-2 group-hover:translate-y-0 shadow-xl
                `}>
                    {lesson.title}
                </div>
            )}

            <button
                onClick={() => !isLocked && onSelect(lesson.slug)}
                disabled={isLocked}
                className={`
                    ${size} rounded-full flex items-center justify-center 
                    border-b-[6px] transition-all duration-200
                    ${finalBg} 
                    ${isActive ? 'ring-8 ring-white/50 scale-110' : 'hover:scale-105 active:border-b-0 active:translate-y-[6px]'}
                    ${isLocked ? 'grayscale opacity-60 cursor-not-allowed' : 'shadow-xl'}
                `}
            >
                {/* Shine effect */}
                <div className="absolute top-2 left-2 w-2/3 h-1/3 rounded-[50%] bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                {isCompleted ? (
                    <Check className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-white/90 stroke-[4] drop-shadow-sm`} />
                ) : isLocked ? (
                    <Lock className={`${compact ? 'w-5 h-5' : 'w-6 h-6'} text-gray-400`} />
                ) : type === 'theory' ? (
                    <BookOpen className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-white fill-current drop-shadow-sm`} />
                ) : (
                    <Code2 className={`${compact ? 'w-6 h-6' : 'w-8 h-8'} text-white fill-current drop-shadow-sm`} />
                )}
            </button>

            {/* Start Flag for first lesson */}
            {lesson.order === 1 && lesson.module.order === 1 && !compact && type === 'theory' && (
                <div className="absolute -left-12 top-2 animate-bounce-slow">
                    <Flag className="w-6 h-6 text-emerald-500 fill-current" />
                </div>
            )}
        </div>
    );
};

export default CourseMap;
