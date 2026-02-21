// Create new widget page — customizer in create mode
'use client';

import CustomizerForm from '@/components/customizer/CustomizerForm';

export default function NewWidgetPage() {
  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">Create New Widget</h1>
      <CustomizerForm />
    </div>
  );
}
