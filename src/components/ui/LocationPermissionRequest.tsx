import React, { useState } from 'react';
import { useLocation } from '../../contexts/LocationContext';

export function LocationPermissionRequest() {
  const { error, isLoading, permissionState, requestLocation } = useLocation();
  const [isHidden, setIsHidden] = useState(false);
  
  // Don't show anything if we're loading or if permissions are granted or if hidden
  if (isLoading || permissionState === 'granted' || isHidden) {
    return null;
  }
  
  // Show a prompt if permission is needed or denied
  if (permissionState === 'prompt' || permissionState === 'denied' || permissionState === 'not-requested') {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-blue-900 rounded-lg shadow-lg p-4 border border-blue-700">
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <svg className="h-5 w-5 text-blue-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-white">
              {permissionState === 'denied' ? 'Location access denied' : 'Use your location?'}
            </h3>
            <div className="mt-1 text-sm text-blue-200">
              <p>
                {permissionState === 'denied' 
                  ? 'Please enable location services for this site in your browser settings to see weather for your location.'
                  : 'Allow this site to access your location to see weather information for your area.'}
              </p>
            </div>
            {permissionState !== 'denied' && (
              <div className="mt-3 flex space-x-2">
                <button
                  type="button"
                  onClick={() => requestLocation()}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900"
                >
                  Allow
                </button>
                <button
                  type="button"
                  onClick={() => setIsHidden(true)}
                  className="inline-flex items-center rounded-md border border-blue-700 bg-transparent px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-900"
                >
                  No thanks
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  return null;
} 