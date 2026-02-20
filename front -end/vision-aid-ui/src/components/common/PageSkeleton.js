/**
 * PageSkeleton — shimmer content-shaped skeleton loaders
 * Used as Suspense fallbacks for lazy-loaded feature pages.
 *
 * Usage:
 *   <Suspense fallback={<PageSkeleton variant="color-picker" />}>
 */

import React, { memo } from 'react';

// Core shimmer animation — single CSS keyframe injected once
const SHIMMER_STYLE = `
@keyframes va-shimmer {
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
}
.va-shimmer {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0) 0%,
    rgba(255,255,255,0.06) 20%,
    rgba(255,255,255,0.12) 40%,
    rgba(255,255,255,0.06) 60%,
    rgba(255,255,255,0) 80%
  );
  background-size: 600px 100%;
  animation: va-shimmer 1.6s infinite linear;
}
.va-shimmer-light {
  background: linear-gradient(
    90deg,
    rgba(0,0,0,0) 0%,
    rgba(0,0,0,0.04) 20%,
    rgba(0,0,0,0.08) 40%,
    rgba(0,0,0,0.04) 60%,
    rgba(0,0,0,0) 80%
  );
  background-size: 600px 100%;
  animation: va-shimmer 1.6s infinite linear;
}
`;

let styleInjected = false;
function injectStyle() {
    if (styleInjected || typeof document === 'undefined') return;
    const tag = document.createElement('style');
    tag.textContent = SHIMMER_STYLE;
    document.head.appendChild(tag);
    styleInjected = true;
}

// ─── Atoms ────────────────────────────────────────────────────────────────────
const Block = memo(({ w = 'w-full', h = 'h-4', className = '', rounded = 'rounded-lg' }) => {
    injectStyle();
    return (
        <div
            className={`${w} ${h} ${rounded} bg-gray-800 relative overflow-hidden ${className}`}
            aria-hidden="true"
        >
            <div className="absolute inset-0 va-shimmer" />
        </div>
    );
});
Block.displayName = 'Block';

const Circle = memo(({ size = 'w-12 h-12' }) => {
    injectStyle();
    return (
        <div className={`${size} rounded-full bg-gray-800 relative overflow-hidden flex-shrink-0`} aria-hidden="true">
            <div className="absolute inset-0 va-shimmer" />
        </div>
    );
});
Circle.displayName = 'Circle';

const Card = memo(({ h = 'h-40', children }) => (
    <div className={`${h} rounded-3xl bg-gray-900/80 border border-white/5 relative overflow-hidden p-6 flex flex-col gap-4`} aria-hidden="true">
        <div className="absolute inset-0 va-shimmer opacity-50" />
        {children}
    </div>
));
Card.displayName = 'Card';

// ─── Variants ─────────────────────────────────────────────────────────────────

/** Color Picker — camera panel + info sidebar */
const ColorPickerSkeleton = memo(() => (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Circle size="w-10 h-10" />
                <div className="space-y-2 flex-1">
                    <Block w="w-48" h="h-7" />
                    <Block w="w-72" h="h-4" />
                </div>
            </div>

            {/* Mode tabs */}
            <div className="flex gap-2">
                {[80, 72, 72, 72].map((w, i) => (
                    <div key={i} className={`w-${w === 80 ? '20' : '16'} h-10 rounded-xl bg-gray-800 relative overflow-hidden`}>
                        <div className="absolute inset-0 va-shimmer" />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Camera view */}
                <div className="md:col-span-2">
                    <Card h="h-80">
                        <div className="flex-1 flex items-center justify-center">
                            <Circle size="w-16 h-16" />
                        </div>
                        <Block w="w-32" h="h-3" />
                    </Card>
                </div>
                {/* Info panel */}
                <div className="space-y-4">
                    <Card h="h-48">
                        <Block h="h-5" />
                        <Block w="w-3/4" h="h-4" />
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            {[...Array(3)].map((_, i) => <Block key={i} h="h-14" rounded="rounded-xl" />)}
                        </div>
                    </Card>
                    <Card h="h-28">
                        <Block h="h-5" />
                        <Block w="w-1/2" h="h-4" />
                    </Card>
                </div>
            </div>
        </div>
    </div>
));
ColorPickerSkeleton.displayName = 'ColorPickerSkeleton';

/** Traffic Signal Detector — wide camera + alert sidebar */
const TrafficSignalSkeleton = memo(() => (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pt-24 pb-12">
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Circle size="w-10 h-10" />
                <div className="space-y-2 flex-1">
                    <Block w="w-56" h="h-7" />
                    <Block w="w-80" h="h-4" />
                </div>
                <Block w="w-28" h="h-10" rounded="rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card h="h-[420px]">
                        <div className="flex-1" />
                        <Block h="h-3" />
                    </Card>
                </div>
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <Card key={i} h="h-28">
                            <div className="flex items-center gap-3">
                                <Circle size="w-10 h-10" />
                                <div className="space-y-2 flex-1">
                                    <Block h="h-4" />
                                    <Block w="w-3/4" h="h-3" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    </div>
));
TrafficSignalSkeleton.displayName = 'TrafficSignalSkeleton';

/** Contrast Checker / Palette Checker — form + results */
const CheckerSkeleton = memo(() => (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center space-y-3">
                <Block w="w-64 mx-auto" h="h-8" />
                <Block w="w-96 mx-auto" h="h-4" />
            </div>
            {/* Color pickers row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, i) => (
                    <Card key={i} h="h-52">
                        <Block h="h-5" w="w-24" />
                        <div className="flex-1 rounded-xl bg-gray-800 relative overflow-hidden">
                            <div className="absolute inset-0 va-shimmer" />
                        </div>
                        <Block h="h-10" rounded="rounded-xl" />
                    </Card>
                ))}
            </div>
            {/* Result card */}
            <Card h="h-36">
                <div className="flex items-center gap-4">
                    <Circle size="w-14 h-14" />
                    <div className="space-y-3 flex-1">
                        <Block w="w-32" h="h-5" />
                        <Block w="w-full" h="h-4" />
                        <div className="flex gap-2">
                            {[...Array(3)].map((_, i) => <Block key={i} w="w-16" h="h-6" rounded="rounded-full" />)}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
));
CheckerSkeleton.displayName = 'CheckerSkeleton';

/** Simulator — filter selector sidebar + image canvas */
const SimulatorSkeleton = memo(() => (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] p-4 pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto space-y-6">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Block w="w-64" h="h-8" />
                    <Block w="w-96" h="h-4" />
                </div>
                <div className="flex gap-2">
                    <Block w="w-28" h="h-10" rounded="rounded-full" />
                    <Block w="w-28" h="h-10" rounded="rounded-full" />
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-4">
                    <Block h="h-12" rounded="rounded-2xl" />
                    <Card h="h-40">
                        <Block h="h-5" w="w-32" />
                        <Block h="h-24" rounded="rounded-xl" />
                    </Card>
                    {/* Mode list */}
                    <div className="space-y-2">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50">
                                <div className="w-1 h-8 rounded bg-gray-800 relative overflow-hidden">
                                    <div className="absolute inset-0 va-shimmer" />
                                </div>
                                <div className="space-y-1 flex-1">
                                    <Block w="w-28" h="h-3" />
                                    <Block w="w-40" h="h-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Preview */}
                <div className="lg:col-span-8">
                    <Card h="h-[600px]">
                        <div className="flex-1 flex items-center justify-center">
                            <Circle size="w-24 h-24" />
                        </div>
                        <Block h="h-4" w="w-48 mx-auto" />
                    </Card>
                </div>
            </div>
        </div>
    </div>
));
SimulatorSkeleton.displayName = 'SimulatorSkeleton';

/** Generic page skeleton — used for info pages, profile, etc. */
const GenericPageSkeleton = memo(() => (
    <div className="min-h-screen bg-[#0a0a0a] p-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center space-y-4">
                <Block w="w-20 h-20 mx-auto" rounded="rounded-2xl" />
                <Block w="w-72 mx-auto" h="h-8" />
                <Block w="w-96 mx-auto" h="h-4" />
            </div>
            {[...Array(3)].map((_, i) => (
                <Card key={i} h="h-32">
                    <Block h="h-5" w="w-48" />
                    <Block h="h-4" />
                    <Block h="h-4" w="w-4/5" />
                </Card>
            ))}
        </div>
    </div>
));
GenericPageSkeleton.displayName = 'GenericPageSkeleton';

// ─── Dispatcher ───────────────────────────────────────────────────────────────
const VARIANT_MAP = {
    'color-picker': ColorPickerSkeleton,
    'traffic-signal': TrafficSignalSkeleton,
    'checker': CheckerSkeleton,
    'palette-checker': CheckerSkeleton,
    'simulator': SimulatorSkeleton,
    'generic': GenericPageSkeleton,
};

const PageSkeleton = ({ variant = 'generic' }) => {
    const SkeletonComponent = VARIANT_MAP[variant] || GenericPageSkeleton;
    return (
        <div role="status" aria-label="Loading page content…">
            <SkeletonComponent />
            <span className="sr-only">Loading…</span>
        </div>
    );
};

export default PageSkeleton;
export {
    ColorPickerSkeleton,
    TrafficSignalSkeleton,
    CheckerSkeleton,
    SimulatorSkeleton,
    GenericPageSkeleton,
};
