import React from 'react';
import { ApiTest } from '@/components/api-test';
import { ResponsiveContainer } from '@/components/responsive-container';

export function ApiTestPage() {
  return (
    <ResponsiveContainer>
      <ApiTest />
    </ResponsiveContainer>
  );
}

export default ApiTestPage;