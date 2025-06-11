
export interface SOPItem {
  id: string;
  text: string;
  completed: boolean;
  subItems?: SOPSubItem[];
}

export interface SOPSubItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface SOPSection {
  id: string;
  title: string;
  items: SOPItem[];
}

export interface SOPChecklist {
  id: string;
  title: string;
  sections: SOPSection[];
  completed: boolean;
}
