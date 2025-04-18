import React from 'react'
import { Box, CustomModalLayout, Image, Modal, TextButton } from '@wix/design-system'
import { ExternalLinkSmall } from '@wix/wix-ui-icons-common'

import iconAppLogo from '../../../../assets/icons/icon_app-logo.svg'
import iconMenuPage from '../../../../assets/icons/icon_menu-page.svg'
import iconOpenPlugin from '../../../../assets/icons/icon_open-plugin.svg'
import step1Image from '../../../../assets/images/image-guide-widget-step-1.png'
import step2Image from '../../../../assets/images/image-guide-widget-step-2.png'
import step3Image from '../../../../assets/images/image-guide-widget-step-3.png'
import classes from './DisplayWidgetGuideModal.module.scss'
import StepCard, { StepCardProps } from './StepCard'

interface WidgetGuideModalProps {
  onModalClosed: () => void
  isModalOpened: boolean
}

const WidgetGuideModal: React.FC<WidgetGuideModalProps> = ({ onModalClosed, isModalOpened }) => {
  const _renderMiniImages = (images: string) => (
    <Image src={images} width="22px" height="22px" borderRadius={0} fit="contain" transparent className={classes['img-icon']} />
  )

  const STEP_CARDS: StepCardProps[] = [
    {
      image: step1Image,
      title: 'Step 1 | Accessing the Product Page settings',
      explain: 'To get started, navigate to the Product Page and access the settings.',
      steps: [
        <a
          key="step1-link"
          href="https://manage.wix.com/account/site-selector/?actionUrl=https%3A%2F%2Fwww.wix.com%2Feditor%2F%7BmetaSiteId%7D%3FeditorSessionId%3D%7Besi%7D%26"
          target="_blank"
          rel="noreferrer"
        >
          <TextButton underline="always" size="small" suffixIcon={<ExternalLinkSmall />}>
            Go to your editor
          </TextButton>
        </a>,
        <span key="step1-page-menu">
          Click Pages Menu
          {_renderMiniImages(iconMenuPage)}
          on the left side of the editor.
        </span>,
        <span key="step1-store-pages">
          Click <strong>Store Pages</strong>
          {' > '}Click <strong>Product Page</strong>.
        </span>,
        <span key="step1-product-page">Click the Product Page element on your page.</span>
      ]
    },
    {
      image: step2Image,
      title: 'Step 2 | Adding the Product Files Plugin',
      explain: "We'll now add the Product Files plugin to the product page.",
      steps: [
        <span key="step2-plugins">
          Click Plugins
          {_renderMiniImages(iconOpenPlugin)}
          on the Product Page menu.
        </span>,
        <span key="step2-plugin-card">Find Product Files Plugin Card {_renderMiniImages(iconAppLogo)}.</span>,
        <span key="step2-add-plugin">
          Hover <strong>Plugin card</strong>
          {' > '}Click <strong>+Add</strong>.
        </span>
      ]
    },
    {
      image: step3Image,
      title: 'Step 3 | Edit and Customize the widget',
      explain: 'You can now edit and customize the Settings and Design of the widget.',
      steps: [
        <span key="step3-recently-viewed">Click the Product Files & PDFs plugin on your Product page.</span>,
        <span key="step3-settings">
          Click <strong>Settings</strong> to change the widget settings.
        </span>,
        <span key="step3-design">Click on any Accessible Part of the widget to change design.</span>
      ]
    }
  ]

  const openPluginArticle = () => {
    window.open(
      'https://dev.wix.com/docs/build-apps/develop-your-app/extensions/site-extensions/site-plugins/about-site-plugin-extensions',
      '_blank'
    )
  }

  const renderModalContent = () => (
    <CustomModalLayout
      onCloseButtonClick={onModalClosed}
      title="Guide to Setup and Customize the Widget"
      subtitle="Follow the steps below to add the widget to your Product Page."
      onHelpButtonClick={openPluginArticle}
      content={
        <Box width="750px" gap="24px" direction="vertical" paddingTop={2} paddingBottom={4}>
          {STEP_CARDS.map((step, index) => (
            <StepCard key={`${index}-${step.title}`} {...step} />
          ))}
        </Box>
      }
    />
  )

  return (
    <Modal isOpen={isModalOpened} onRequestClose={onModalClosed} shouldCloseOnOverlayClick>
      {renderModalContent()}
    </Modal>
  )
}

export default WidgetGuideModal
