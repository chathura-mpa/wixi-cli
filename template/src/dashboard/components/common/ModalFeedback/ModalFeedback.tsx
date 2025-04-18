import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  CustomModalLayout,
  Image,
  Loader,
  Modal,
  Text,
  TextButton,
} from "@wix/design-system";
import * as Icons from "@wix/wix-ui-icons-common";
import { useIntercom } from "react-use-intercom";

import imageWidgetPreview from "../../../../assets/images/image-widget-preview.png";
import imageUserFeedback from "../../../../assets/images/image_user-feedback.svg";
import { APP_ID, APP_NAME } from "../../../../constants";
import classes from "./ModalFeedback.module.scss";

const ModalFeedback: React.FC<{
  onModalClosed: () => void;
  onUserReviewed: () => void;
  isModalOpened: boolean;
}> = (props) => {
  const { showNewMessage } = useIntercom();
  const [showFeedback, setShowFeedback] = useState(false);
  const [isUserClickPostBtn, setIsUserClickPostBtn] = useState(false);

  const [isFirefox, setIsFirefox] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsFirefox(userAgent.indexOf("firefox") > -1);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [showFeedback]);

  const handleWidgetNotSetupStatus = () => {
    openIntercomWithContent("I couldn't setup my widget--> ");
    handleOnRequestClose();
  };

  const handleOnRequestClose = () => {
    props.onModalClosed();
    setTimeout(() => {
      setShowFeedback(false);
    }, 1000);
  };

  const scrollToBottom = () => {
    const element = document.getElementById("scrollableIframe");
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  };

  const openIntercomWithContent = useCallback(
    (message: string | undefined) => showNewMessage(message),
    [showNewMessage]
  );

  const markAsReviewed = () => {
    setIsUserClickPostBtn(true);
    props.onUserReviewed();
  };

  const iframeURL = `https://www.wix.com/app-market/add-review/${APP_ID}`;

  const wixFeedbackIframe = () => {
    const hideIframe = isFirefox && isLoaded;
    return (
      <>
        {!isLoaded && (
          <Box align="center" verticalAlign="middle" height="428px">
            <Loader size="medium" />
          </Box>
        )}
        {isFirefox && (
          <Box padding={6} paddingTop={0}>
            <TextButton
              onClick={() => {
                window.open(iframeURL, "_blank");
              }}
              size="medium"
              prefixIcon={<Icons.ExternalLink />}
            >
              Add a Review for {APP_NAME} 🙏
            </TextButton>
          </Box>
        )}

        <div
          className={hideIframe ? "sr-only" : classes["frame-container"]}
          id="scrollableIframe"
        >
          <iframe
            className={classes["feedback-iframe"]}
            src={iframeURL}
            width="600px"
            height="572px"
            title="User Feedback Review"
            onLoad={() => setIsLoaded(true)}
          ></iframe>

          {!isUserClickPostBtn && (
            <button
              className={classes["overlay-container"]}
              onClick={markAsReviewed}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  markAsReviewed();
                }
              }}
              tabIndex={0}
            ></button>
          )}
        </div>
      </>
    );
  };

  const renderFeedbackContent = () => (
    <Box gap="8px" direction="vertical" flex={1}>
      <Box gap="24px" padding="32px 36px 12px 36px">
        <Box gap="12px" direction="vertical">
          <Box gap="24px">
            <Box gap="6px" direction="vertical" flex={1}>
              <Text size="medium">
                We hope you've had a good experience with the app so far! We
                would really appreciate it if you can add a review for{" "}
                {APP_NAME}.
              </Text>
              <Text size="medium">It helps immensely! ♥️</Text>
            </Box>
            <Image
              width="120px"
              height="120px"
              src={imageUserFeedback}
              transparent
            />
          </Box>
        </Box>
      </Box>

      {wixFeedbackIframe()}
    </Box>
  );

  const renderQuestionContent = () => (
    <Box gap="8px" direction="vertical" flex={1}>
      <Box gap="12px" direction="vertical" padding="32px 36px 28px 36px">
        <Box gap="4px" direction="vertical">
          <Text size="medium" weight="bold" className={classes["medium-hight"]}>
            Did you manage to set up the app?
          </Text>
          <Text size="medium">
            Please confirm that you saw the widget on your site and it works
            correctly!
          </Text>
        </Box>
        <Box gap="12px">
          <Button
            prefixIcon={<Icons.Confirm />}
            onClick={() => setShowFeedback(true)}
          >
            Yes
          </Button>
          <Button priority="secondary" onClick={handleWidgetNotSetupStatus}>
            No
          </Button>
        </Box>
      </Box>
      <Image src={imageWidgetPreview} width="600px" height="400px"></Image>
    </Box>
  );

  const renderModalContent = () => (
    <CustomModalLayout
      onCloseButtonClick={handleOnRequestClose}
      removeContentPadding
      width="600px"
      content={
        <>
          {!showFeedback && renderQuestionContent()}

          <div className={!showFeedback ? "sr-only" : undefined}>
            {renderFeedbackContent()}
          </div>
        </>
      }
    />
  );

  return (
    <Modal
      isOpen={props.isModalOpened}
      onRequestClose={handleOnRequestClose}
      shouldCloseOnOverlayClick={!showFeedback || isUserClickPostBtn}
      zIndex={9999999}
    >
      {renderModalContent()}
    </Modal>
  );
};
export default ModalFeedback;
