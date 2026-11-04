export type TemplateCategory =
  | 'ats'
  | 'modern'
  | 'professional'
  | 'corporate'
  | 'creative'
  | 'academic'
  | 'minimal';

export type TemplateLayoutType =
  | 'single-column'
  | 'two-column'
  | 'sidebar'
  | 'compact';

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateCategory;
  categoryLabel: string;
  description: string;
  atsScore: string;
  accentColor: string;
  secondaryColor?: string;
  layoutType: TemplateLayoutType;
  recommendedFor: string;
  tags: string[];
  isAtsOptimized: boolean;
}

