import { Box, Text, Button } from "zmp-ui";
import { useState, useEffect } from "react";
import { API_CONFIG, apiHelpers } from "../config/api";

function DebugInfo() {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAPI = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing API connection...');
      console.log('📍 API Base URL:', API_CONFIG.BASE_URL);
      console.log('🌐 Current origin:', window.location.origin);
      console.log('📱 User Agent:', navigator.userAgent);
      
      // Test multiple endpoints
      const endpoints = ['/api/test', '/api/health', '/api/cors-test'];
      const results = {};
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔄 Testing ${endpoint}...`);
          const response = await apiHelpers.fetchWithRetry(endpoint);
          const data = await response.json();
          results[endpoint] = { success: true, data };
          console.log(`✅ ${endpoint} success:`, data);
        } catch (error) {
          results[endpoint] = { success: false, error: error.message };
          console.error(`❌ ${endpoint} failed:`, error);
        }
      }
      
      setDebugInfo({
        success: true,
        results,
        timestamp: new Date().toISOString(),
        apiBaseUrl: API_CONFIG.BASE_URL,
        currentOrigin: window.location.origin,
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('❌ API Test Failed:', error);
      setDebugInfo({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
        apiBaseUrl: API_CONFIG.BASE_URL,
        currentOrigin: window.location.origin,
        userAgent: navigator.userAgent
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto test on mount
    testAPI();
  }, []);

  return (
    <Box className="p-4 bg-gray-100 rounded-lg m-4">
      <Text.Title className="text-lg font-bold mb-3">🔧 Debug Information</Text.Title>
      
      <Button 
        onClick={testAPI} 
        loading={loading}
        className="mb-3 w-full"
      >
        Test API Connection
      </Button>

      {debugInfo && (
        <Box className="bg-white p-3 rounded border">
          <Text className="font-bold mb-2">
            Status: {debugInfo.success ? '✅ Success' : '❌ Failed'}
          </Text>
          
          <Text size="small" className="block mb-1">
            <strong>API Base URL:</strong> {debugInfo.apiBaseUrl}
          </Text>
          
          <Text size="small" className="block mb-1">
            <strong>Current Origin:</strong> {debugInfo.currentOrigin}
          </Text>
          
          <Text size="small" className="block mb-1">
            <strong>Timestamp:</strong> {debugInfo.timestamp}
          </Text>
          
          {debugInfo.success && debugInfo.results ? (
            <Box>
              {Object.entries(debugInfo.results).map(([endpoint, result]) => (
                <Box key={endpoint} className="mb-2 p-2 bg-gray-50 rounded">
                  <Text size="small" className="font-bold">
                    {endpoint}: {result.success ? '✅' : '❌'}
                  </Text>
                  {result.success ? (
                    <Text size="xSmall" className="text-green-600">
                      {result.data?.message || 'Success'}
                    </Text>
                  ) : (
                    <Text size="xSmall" className="text-red-600">
                      {result.error}
                    </Text>
                  )}
                </Box>
              ))}
            </Box>
          ) : (
            <Text size="small" className="block text-red-600">
              <strong>Error:</strong> {debugInfo.error}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
}

export default DebugInfo;
