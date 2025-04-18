import React from "react";
import {
  CustomModalLayout,
  Box,
  Text,
  Button,
  Heading,
  Layout,
  Cell,
} from "@wix/design-system";
import { ExternalLinkSmall } from "@wix/wix-ui-icons-common";

import classes from "./ModalWidgetGuide.module.scss";

import { GUIDE_JAR_IFRAMES } from "../../../../constants/index";

const CMWidgetGuide: React.FC<{
  onModalClosed: () => void;
  previewURL?: string;
}> = ({ onModalClosed, previewURL }) => {
  function openPreviewURl() {
    if (!previewURL) return;
    window.open(previewURL, "_blank", "noopener");
  }
  return (
    <CustomModalLayout
      onCloseButtonClick={onModalClosed}
      title="Have you Published the Site?"
      width={900}
      removeContentPadding
      content={
        <Layout>
          <Cell span={11}>
            <Box
              direction="vertical"
              gap={3}
              paddingBottom={4}
              padding="0 24px 0 24px"
            >
              <Text size="small">
                The widget preview may not be available if you have not
                Published the site after setting up the widget. If you have
                already completed this step, you can ignore the publishing guide
                and proceed to the live preview.
              </Text>
              {previewURL && (
                <Box>
                  <Button
                    size="small"
                    prefixIcon={<ExternalLinkSmall />}
                    onClick={openPreviewURl}
                  >
                    Live Preview Anyway
                  </Button>
                </Box>
              )}
            </Box>
          </Cell>
          <Cell>
            <Box
              gap={4}
              direction="vertical"
              width="100%"
              backgroundColor="var(--wsr-color-D70, #F0F4F7)"
              borderTop="1px solid var(--wds-color-border-dark-secondary, var(--wsr-color-D60, #DFE5EB))"
              padding="24px 24px 0 24px"
            >
              <Box direction="vertical" gap={1}>
                <Heading size="small">Guide to Publish the Site</Heading>
                <Text size="small" secondary>
                  Follow the steps below to publish the site and view the widget
                </Text>
              </Box>
              <Box className={classes["iframe-container"]}>
                <iframe
                  src={GUIDE_JAR_IFRAMES.PUBLISH_SITE_FLOW_URL}
                  width="100%"
                  height="100%"
                  className={classes["iframe-inner-wrapper"]}
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              </Box>
            </Box>
          </Cell>
        </Layout>
      }
    />
  );
};

export default CMWidgetGuide;
