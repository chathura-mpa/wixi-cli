import React from "react";
import { CustomModalLayout, Box, TextButton, Text } from "@wix/design-system";
import { dashboard } from "@wix/dashboard";
import * as Icons from "@wix/wix-ui-icons-common";

import classes from "./ModalWidgetGuide.module.scss";

import { GUIDE_JAR_IFRAMES } from "../../../../constants/index";
const WIX_HOME_PAGE_ID = "2e96bad1-df32-47b6-942f-e3ecabd74e57";

const CMWidgetGuide: React.FC<{
  onModalClosed: () => void;
}> = ({ onModalClosed }) => {
  async function openHomePage() {
    try {
      const pageUrl = await dashboard.getPageUrl({
        pageId: WIX_HOME_PAGE_ID,
      });
      window.open(pageUrl, "_blank", "noopener"); // Open the product edit page in a new tab
    } catch (error) {
      console.error("Failed to open home page:", error);
      alert("Failed to open the Home page. Please try again later."); // User-friendly error message
    }
  }

  return (
    <CustomModalLayout
      onCloseButtonClick={onModalClosed}
      title="Guide to Setup and Customize the Widget"
      subtitle="Follow the steps below to add the widget to your Product Page."
      width={900}
      content={
        <Box direction="vertical" gap={2}>
          <Box
            className={classes["info-wrapper"]}
            gap={1}
            verticalAlign="middle"
          >
            <Text>
              <b>Note:</b> Let&apos;s start by opening the Home page in a new tab.
            </Text>
            <TextButton
              suffixIcon={<Icons.ExternalLinkSmall />}
              onClick={openHomePage}
              size="medium"
            >
              Open Home
            </TextButton>
          </Box>

          <Box className={classes["iframe-container"]}>
            <iframe
              src={GUIDE_JAR_IFRAMES.MAIN_FLOW_URL}
              width="100%"
              height="100%"
              className={classes["iframe-inner-wrapper"]}
              allowFullScreen
              style={{ border: 0 }}
              title="Guide to Setup and Customize the Widget"
            ></iframe>
          </Box>
        </Box>
      }
    />
  );
};

export default CMWidgetGuide;
