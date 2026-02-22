// Reusable form section wrapper with heading
interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold">{title}</legend>
      <div className="h-px bg-gray-200 dark:bg-white/10" />
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
