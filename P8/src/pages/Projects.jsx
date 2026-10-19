import React, { lazy, Suspense } from 'react';
const ChartComponent = lazy(() => import('../components/ChartComponent'));

export default function Projects() {
  return (
    <div>
      <h2>Projects</h2>
      <p>This is the lazy loaded projects page.</p>
      <Suspense fallback={<p>Loading Chart...</p>}>
        <ChartComponent />
      </Suspense>
    </div>
  );
}
