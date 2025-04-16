import React from 'react';

export const TestTailwind = () => {
  return (
    <div className="p-4">
      <div className="bg-blue-100 p-4 shadow rounded-md">
        <h2 className="text-lg font-medium">Test Component</h2>
        <p className="mt-2 text-gray-600">
          Testing Tailwind CSS utility classes like rounded-md
        </p>
      </div>
      
      {/* Testing individual classes */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="p-2 bg-gray-100 rounded">rounded</div>
        <div className="p-2 bg-gray-100 rounded-sm">rounded-sm</div>
        <div className="p-2 bg-gray-100 rounded-md">rounded-md</div>
        <div className="p-2 bg-gray-100 rounded-lg">rounded-lg</div>
      </div>
    </div>
  );
}; 