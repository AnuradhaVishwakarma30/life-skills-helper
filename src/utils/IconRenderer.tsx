import * as Icons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconRendererProps extends LucideProps {
  name: string;
}

export const IconRenderer = ({ name, ...props }: IconRendererProps) => {
  const IconComponent = (Icons as Record<string, React.ComponentType<LucideProps>>)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
};
