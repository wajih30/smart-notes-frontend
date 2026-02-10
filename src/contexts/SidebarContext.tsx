import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    sidebarContent: ReactNode | null;
    setSidebarContent: (content: ReactNode | null) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [sidebarContent, setSidebarContent] = useState<ReactNode | null>(null);

    return (
        <SidebarContext.Provider value={{ sidebarContent, setSidebarContent }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};
