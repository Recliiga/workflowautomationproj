
export interface LeadInfo {
  name: string;
  company?: string;
  interests?: string;
  budget?: string;
  timeline?: string;
  notes?: string;
}

export interface ScriptResponse {
  id: string;
  stage: string;
  text: string;
  context: string;
  effectiveness: number;
}

export interface SalesStage {
  id: string;
  label: string;
  icon: any;
  color: string;
}
