import React from 'react';
import { Check, Lock, Star, Play } from 'lucide-react';

const CourseMap = ({ course, activeLesson, onSelectLesson }) => {
    if (!course) return null;

    return (
        <div className="flex flex-col items-center py-10 space-y-12 w-full max-w-2xl mx-auto">
            <header className="text-center mb-8">
                <h2 className="text-3xl font-black text-gray-800 tracking-tight">{course.title}</h2>
                <p className="text-gray-500 font-medium mt-2">{course.description}</p>
            </header>

            {course.modules.map((module, modIndex) => (
                <div key={module.id} className="w-full relative">
                    {/* Module Header */}
                    <div className="absolute -top-6 left-0 right-0 text-center">
                        <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${module.lessons.some(l => l.is_unlocked) ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-400'
                            }`}>
                            {module.title}
                        </span>
                    </div>

                    <div className="flex flex-col items-center space-y-6 pt-6">
                        {module.lessons.map((lesson, lessonIndex) => {
                            // Calculate position for wavy path effect
                            // 0 -> center, 1 -> left, 2 -> center, 3 -> right ...
                            const offsetMap = [0, -40, 0, 40];
                            const offset = offsetMap[lessonIndex % 4];

                            const isLocked = !lesson.is_unlocked;
                            const isCompleted = lesson.is_completed;
                            const isActive = activeLesson?.id === lesson.id;

                            return (
                                <div
                                    key={lesson.id}
                                    className="relative z-10"
                                    style={{ transform: `translateX(${offset}px)` }}
                                >
                                    <button
                                        onClick={() => !isLocked && onSelectLesson(lesson.slug)}
                                        disabled={isLocked}
                                        className={`w-20 h-20 rounded-full flex items-center justify-center border-b-4 transition-all transform hover:scale-105 active:scale-95 ${isCompleted
                                                ? 'bg-yellow-400 border-yellow-600 text-white'
                                                : isLocked
                                                    ? 'bg-gray-200 border-gray-300 text-gray-400'
                                                    : 'bg-indigo-500 border-indigo-700 text-white animate-pulse-slow shadow-lg shadow-indigo-200'
                                            } ${isActive ? 'ring-4 ring-indigo-200' : ''}`}
                                    >
                                        {isCompleted ? (
                                            <Check className="w-8 h-8 stroke-[4]" />
                                        ) : isLocked ? (
                                            <Lock className="w-8 h-8" />
                                        ) : (
                                            <Star className="w-8 h-8 fill-current" />
                                        )}
                                    </button>

                                    {/* Tooltip / Label */}
                                    <div className="absolute top-2 w-48 text-center -left-14 -translate-y-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none mb-2">
                                        <div className="bg-gray-800 text-white text-xs py-1 px-2 rounded-lg">
                                            {lesson.title}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-xs font-bold text-gray-400 text-center max-w-[120px] mx-auto">
                                        {lesson.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}

            <div className="h-24 text-center text-gray-300 text-sm font-bold uppercase tracking-widest">
                More levels coming soon!
            </div>
        </div>
    );
};

export default CourseMap;
