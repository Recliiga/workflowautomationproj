
import { createContext, useContext, ReactNode } from "react";

type ViewModeType = "twoWeeks" | "month";

interface ViewModeContextType {
  viewMode: ViewModeType;
}

const ViewModeContext = createContext<ViewModeContextType>({ viewMode: "twoWeeks" });

export const useViewMode = () => useContext(ViewModeContext);

interface ViewModeProviderProps {
  children: ReactNode;
  viewMode: ViewModeType;
}

export function ViewModeProvider({ children, viewMode }: ViewModeProviderProps) {
  return (
    <ViewModeContext.Provider value={{ viewMode }}>
      {children}
    </ViewModeContext.Provider>
  );
}
