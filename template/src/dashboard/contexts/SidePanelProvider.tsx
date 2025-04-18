import React, { createContext, useContext, useState } from 'react';

interface SidePanelContextValue {
    openPanel: (panel: React.ReactNode) => void;
    closePanel: () => void;
}

const SidePanelContext = createContext<SidePanelContextValue | undefined>(undefined);

export const useSidePanel = (): SidePanelContextValue => {
    const context = useContext(SidePanelContext);
    if (!context) {
        throw new Error('useSidePanel must be used within SidePanelProvider');
    }
    return context;
};

interface SidePanelProviderProps {
    children: React.ReactNode;
}

export const SidePanelProvider: React.FC<SidePanelProviderProps> = ({ children }) => {
    const [panelNode, setPanelNode] = useState<React.ReactNode>(null);
    const [isVisible, setIsVisible] = useState(false);

    const openPanel = (panel: React.ReactNode) => {
        setPanelNode(panel);
        setTimeout(() => setIsVisible(true), 10);
    };

    const closePanel = () => {
        setIsVisible(false);
        setTimeout(() => setPanelNode(null), 10);
    };

    return (
        <SidePanelContext.Provider value={{ openPanel, closePanel }}>
            {children}
            {panelNode && (
                <>
                    <div
                        className={`overlay ${isVisible ? 'open' : ''}`}
                        onClick={closePanel}
                    />
                    {/* Don't wrap panelNode */}
                    {panelNode}
                </>
            )}
        </SidePanelContext.Provider>
    );
};