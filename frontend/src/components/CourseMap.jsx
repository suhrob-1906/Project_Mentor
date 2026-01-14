import React, { useRef, useEffect, useState } from 'react';
import { Check, Lock, Star, Play, Flag, BookOpen, Code2, Award } from 'lucide-react';

const CourseMap = ({ course, activeLesson, onSelectLesson }) => {
    if (!course) return null;

    // Flatten all lessons into a single list for easier path drawing
    const allLessons = course.modules.flatMap(m => m.lessons);

    // Configuration for the wavy path
    const curveWidth = 60; // How wide the wave goes left/right
    const stepHeight = 100; // Vertical distance between lessons
    const startY = 100; // Top padding

    // Helper to calculate position of a lesson node
    const getPosition = (index) => {
        // Sine wave pattern: 0 -> center, 1 -> left, 2 -> center, 3 -> right
        const cycle = index % 4;
        let x = 0;
        if (cycle === 1) x = -curveWidth;
        if (cycle === 3) x = curveWidth;

        const y = startY + (index * stepHeight);
        return { x, y };
    };

    // Generate SVG path string
    const generatePath = () => {
        let path = "";
        for (let i = 0; i < allLessons.length - 1; i++) {
            const current = getPosition(i);
            const next = getPosition(i + 1);

            // Draw a curved line between points using Bezier curves
            const midY = (current.y + next.y) / 2;

            if (i === 0) path += `M ${current.x + 300} ${current.y} `; // +300 to center in 600px wide SVG

            // Cubic Bezier: C control1, control2, end
            // We offset control points horizontally based on direction for smoothness
            path += `C ${current.x + 300} ${midY}, ${next.x + 300} ${midY}, ${next.x + 300} ${next.y} `;
        }
        return path;
    };

    return (
        <div className="flex flex-col items-center py-10 w-full max-w-2xl mx-auto relative min-h-screen">
            <header className="text-center mb-12 z-10 relative">
                <div className="inline-block bg-yellow-400 p-3 rounded-2xl rotate-3 shadow-lg mb-4 cursor-default transition hover:rotate-6 hover:scale-110">
                    <Star className="w-8 h-8 text-yellow-900 fill-current" />
                </div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">{course.title}</h2>
                <p className="text-gray-400 font-bold mt-2 uppercase tracking-widest text-xs">{course.description}</p>
            </header>

            <div className="relative w-full flex justify-center" style={{ height: `${allLessons.length * stepHeight + 200}px` }}>

                {/* 1. SVG Path (Background) */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-visible" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e5e7eb" stopOpacity="0" />
                            <stop offset="10%" stopColor="#e5e7eb" stopOpacity="1" /> {/* Visible path */}
                            <stop offset="90%" stopColor="#e5e7eb" stopOpacity="1" />
                        </linearGradient>
                    </defs>
                    {/* Centered group */}
                    <g transform="translate(0, 50)">
                        {/* We manually centered in calculate function by adding offsets, but parent div centering works too */}
                        <path
                            d={generatePath()}
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="12"
                            strokeLinecap="round"
                            strokeDasharray="20 10"
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
                    let yOffset = "translate-y-0";

                    if (!isLocked) {
                        if (isCompleted) {
                            bgColor = "bg-yellow-400";
                            borderColor = "border-yellow-600";
                            iconColor = "text-yellow-900";
                            yOffset = "active:translate-y-1 active:border-b-0"; // squish effect
                        } else {
                            bgColor = "bg-indigo-500 hover:bg-indigo-400";
                            borderColor = "border-indigo-700";
                            iconColor = "text-white";
                            yOffset = "active:translate-y-1 active:border-b-0";
                        }
                    }

                    return (
                        <div
                            key={lesson.slug}
                            className="absolute flex flex-col items-center group z-10"
                            style={{
                                top: `${pos.y + 50}px`,
                                left: `50%`,
                                transform: `translateX(${pos.x}px) translateX(-50%)` // Center horizontally based on wave
                            }}
                        >
                            {/* Floating Module Title if first lesson of module */}
                            {lesson.order === 1 && (
                                <div className="absolute -top-12 bg-white border-2 border-gray-100 px-4 py-1 rounded-xl shadow-sm whitespace-nowrap z-0">
                                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                        {course.modules.find(m => m.id === lesson.module)?.title || "Module"}
                                    </span>
                                </div>
                            )}

                            {/* The Big Button */}
                            <button
                                onClick={() => !isLocked && onSelectLesson(lesson.slug)}
                                disabled={isLocked}
                                className={`
                                    w-20 h-20 rounded-full flex items-center justify-center 
                                    border-b-[6px] transition-all duration-150 relative
                                    ${bgColor} ${borderColor} ${yOffset}
                                    ${isActive ? 'ring-8 ring-indigo-200 animate-pulse' : ''}
                                `}
                            >
                                {/* Inner highlight for 3D effect */}
                                <div className="absolute top-2 left-2 w-16 h-16 rounded-full border-t-4 border-white opacity-20 pointer-events-none"></div>

                                {isCompleted ? (
                                    <Check className={`w-8 h-8 stroke-[4] ${iconColor}`} />
                                ) : isLocked ? (
                                    <Lock className={`w-7 h-7 ${iconColor}`} />
                                ) : (
                                    lesson.lesson_type === 'theory' ? (
                                        <BookOpen className={`w-8 h-8 fill-current ${iconColor}`} />
                                    ) : (
                                        <Code2 className={`w-8 h-8 fill-current ${iconColor}`} />
                                    )
                                )}
                            </button>

                            {/* Tooltip / Label */}
                            <div className="absolute top-24 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 pointer-events-none z-20">
                                <div className="bg-gray-800 text-white text-xs font-bold py-2 px-3 rounded-lg shadow-xl relative mt-2">
                                    {lesson.title}
                                    {/* Triangle */}
                                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Start Flag */}
                <div className="absolute text-gray-300 font-black uppercase text-xs tracking-widest flex flex-col items-center gap-2"
                    style={{ top: '60px', left: '50%', transform: 'translateX(-50%)' }}>
                    <Flag className="w-6 h-6" />
                    Start
                </div>

            </div>

            <div className="h-32 text-center text-gray-300 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                {allLessons.every(l => l.is_completed) ? (
                    <button
                        onClick={() => window.location.href = `/courses/${course.slug}/completion`}
                        className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-yellow-900 font-black rounded-2xl shadow-xl shadow-yellow-200/50 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 animate-bounce-slow"
                    >
                        <Award className="w-5 h-5" />
                        Get Your Certificate
                    </button>
                ) : (
                    <>
                        <Lock className="w-4 h-4" />
                        More levels coming soon
                    </>
                )}
            </div>
        </div>
    );
};

export default CourseMap;
