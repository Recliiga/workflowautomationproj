
import { useState } from "react";
import { VideoTypeManager } from "./VideoTypeManager";

export function GlobalSettingsTab() {
  const [globalVideoTypes, setGlobalVideoTypes] = useState<string[]>([
    "Dialogue",
    "Evergreen Content",
    "Exercises",
    "Huge Client Win",
    "Partnership/Sponsorship",
    "Testimonial"
  ]);
  
  const handleVideoTypesChange = (newTypes: string[]) => {
    setGlobalVideoTypes(newTypes);
  };
  
  return (
    <div className="grid grid-cols-1 gap-6">
      <VideoTypeManager 
        initialTypes={globalVideoTypes} 
        onTypesChange={handleVideoTypesChange} 
      />
    </div>
  );
}
