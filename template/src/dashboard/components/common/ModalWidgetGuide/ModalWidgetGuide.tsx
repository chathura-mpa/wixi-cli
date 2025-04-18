import React, { useEffect, useRef, useCallback } from "react";

import { Modal } from "@wix/design-system";

import CMWidgetGuide from "./CMWidgetGuide";
import CMPublishGuide from "./CMPublishGuide";
import { useAppData } from "../../../contexts/AppDataProvider";

export type GuideTypes = "preview" | "default";

interface ModalWidgetGuideProps {
  onModalClosed: (type?: any) => void;
  isModalOpened: boolean;
  guideType?: GuideTypes;
  previewURL?: string;
}

const ModalWidgetGuide: React.FC<ModalWidgetGuideProps> = ({
  isModalOpened,
  onModalClosed,
  guideType = "default",
  previewURL,
}) => {
  const FETCH_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const REFRESH_INTERVAL = 5000; // 5 seconds

  const intervalIdRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { siteSettings, loadSiteSettings } = useAppData()

  const refreshFetchSettings = useCallback(async () => {
    try {
      // await loadSiteSettings();
      // setSettings(data);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  }, [loadSiteSettings]);

  const clearIntervals = useCallback(() => {
    if (intervalIdRef.current) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isModalOpened && guideType === "preview") {
      // Start fetching settings immediately
      // loadSiteSettings();

      // Set interval for periodic updates
      intervalIdRef.current = setInterval(
        loadSiteSettings,
        REFRESH_INTERVAL
      );

      // Set timeout to stop periodic updates after FETCH_TIMEOUT
      timeoutIdRef.current = setTimeout(clearIntervals, FETCH_TIMEOUT);
    }

    // Clear intervals if `openedSite` is true or when the modal is closed
    if (siteSettings?.openedSite || !isModalOpened) {
      clearIntervals();
    }
    if (siteSettings?.openedSite && isModalOpened && guideType === "preview") {
      onModalClosed();
    }

    // Cleanup on component unmount
    return () => clearIntervals();
  }, [
    isModalOpened,
    guideType,
    siteSettings?.openedSite,
    refreshFetchSettings,
    clearIntervals,
  ]);

  const showPublishGuide = guideType === "preview" && siteSettings?.openedEditor;

  return (
    <Modal
      isOpen={isModalOpened}
      onRequestClose={onModalClosed}
      shouldCloseOnOverlayClick
      zIndex={9999999}
    >
      {showPublishGuide ? (
        <CMPublishGuide onModalClosed={onModalClosed} previewURL={previewURL} />
      ) : (
        <CMWidgetGuide onModalClosed={onModalClosed} />
      )}
    </Modal>
  );
};

export default ModalWidgetGuide;
