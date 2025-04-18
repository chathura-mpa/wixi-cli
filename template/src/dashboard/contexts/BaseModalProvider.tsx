import React, {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useMemo,
    useState,
} from "react";
import { dashboard } from "@wix/dashboard";

import ModalFeedback from "../components/common/ModalFeedback";
import {
    GuideTypes,
    ModalWidgetGuide,
} from "../components/common/ModalWidgetGuide";
import { requestSetSettings } from "../services/site-data";
import { echo } from "../utils/logger";
import { useAppData } from "./AppDataProvider";

type BaseModalContextType = {
    checkAndOpenWidgetPreview: (previewURL?: string) => void;
    openGuideModal: (type?: GuideTypes, previewURL?: string) => void;
    openFeedbackModal: () => void;
    checkAndDisplayFeedbackModal: (
        time?: number,
        type?: "auto" | "request" | "close"
    ) => void;
};

const BaseModalContext = createContext<BaseModalContextType | undefined>(
    undefined
);

const useModalState = () => {
    const [modalState, setModalState] = useState({
        isGuideModalOpen: false,
        guideType: "default" as GuideTypes,
        previewURL: undefined as string | undefined,
        isFeedbackModalOpen: false,
    });

    return {
        modalState,
        setModalState,
    };
};

export const BaseModalProvider = ({ children }: { children: ReactNode }) => {
    const { modalState, setModalState } = useModalState();
    const { siteSettings, setSiteSettings } = useAppData();

    // Function to handle feedback modal display
    const checkAndDisplayFeedbackModal = useCallback(
        (time: number = 10000, type: "auto" | "request" | "close" = "auto") => {
            const sessionKey = `pluginFeedbackModalShown${type.charAt(0).toUpperCase() + type.slice(1)}`;
            const hasAlreadyShown = sessionStorage.getItem(sessionKey);

            const isAskConditionTrue = () => {
                const { is_user_reviewed, openedSite } = siteSettings || {};
                if (type === "request") return !is_user_reviewed;
                if (type === "close") return openedSite && !is_user_reviewed;

                return openedSite && !is_user_reviewed;
            };

            if (isAskConditionTrue() && !hasAlreadyShown) {
                setTimeout(() => {
                    setModalState((prev) => ({ ...prev, isFeedbackModalOpen: true }));
                    sessionStorage.setItem(sessionKey, "true");
                }, time);
            }
        },
        [siteSettings, setModalState]
    );

    // Function to handle widget preview
    const checkAndOpenWidgetPreview = useCallback(
        (previewURL?: string) => {
            if (siteSettings?.openedSite) {
                if (!previewURL) {
                    dashboard.showToast({
                        message: "Preview URL is missing",
                        type: "error",
                    });
                    return;
                }
                window.open(previewURL, "_blank", "noopener");
                checkAndDisplayFeedbackModal(1000, "request");
                return;
            }
            setModalState((prev) => ({
                ...prev,
                isGuideModalOpen: true,
                guideType: "preview",
                previewURL,
            }));
        },
        [siteSettings, setModalState, checkAndDisplayFeedbackModal]
    );

    // Function to open the guide modal
    const openGuideModal = useCallback(
        (type: GuideTypes = "default", previewURL?: string) => {
            setModalState((prev) => ({
                ...prev,
                isGuideModalOpen: true,
                guideType: type,
                previewURL,
            }));
        },
        [setModalState]
    );

    // Function to open the feedback modal
    const openFeedbackModal = useCallback(() => {
        setModalState((prev) => ({ ...prev, isFeedbackModalOpen: true }));
    }, [setModalState]);

    // Update site settings
    const updateSiteSettings = useCallback(
        async (newSettings: object) => {
            try {
                setSiteSettings((prev) => ({ ...prev, ...newSettings }));
                await requestSetSettings(newSettings);
            } catch (error) {
                console.error("Failed to update settings", error);
                dashboard.showToast({
                    message: "Failed to update settings. Please try again.",
                    type: "error",
                });
            }
        },
        [setSiteSettings]
    );

    const contextValue = useMemo(
        () => ({
            openGuideModal,
            openFeedbackModal,
            checkAndOpenWidgetPreview,
            checkAndDisplayFeedbackModal,
        }),
        [
            openGuideModal,
            openFeedbackModal,
            checkAndOpenWidgetPreview,
            checkAndDisplayFeedbackModal,
        ]
    );

    return (
        <BaseModalContext.Provider value={contextValue}>
            {children}
            <ModalWidgetGuide
                isModalOpened={modalState.isGuideModalOpen}
                onModalClosed={(type) => {
                    setModalState((prev) => ({ ...prev, isGuideModalOpen: false }));
                    checkAndDisplayFeedbackModal(1000, type);
                }}
                guideType={modalState.guideType}
                previewURL={modalState.previewURL}
            />
            <ModalFeedback
                isModalOpened={modalState.isFeedbackModalOpen}
                onModalClosed={() =>
                    setModalState((prev) => ({ ...prev, isFeedbackModalOpen: false }))
                }
                onUserReviewed={() => {
                    updateSiteSettings({ is_user_reviewed: true });
                }}
            />
        </BaseModalContext.Provider>
    );
};

export const useBaseModal = () => {
    const context = useContext(BaseModalContext);
    if (!context) {
        throw new Error("useBaseModal must be used within a BaseModalProvider");
    }
    return context;
};
