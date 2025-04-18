import React, { useEffect, type FC } from 'react'
import { Box, Button, IconButton, Page, Tooltip } from '@wix/design-system'
import { useIntercom } from 'react-use-intercom'

import * as Icons from '@wix/wix-ui-icons-common'

import { APP_NAME, HELP_CENTER_URL } from '../../constants'
import { withProviders } from '../../withProviders'
import { useAppData } from '../contexts/AppDataProvider'
import { useBaseModal } from '../contexts/BaseModalProvider'
import PageLayout from '../components/layout/PageLayout'
import AppRouter from '../routes'

import { openExternalUrl } from '../utils'

const Index: FC = () => {
  const { boot } = useIntercom()
  const { siteData, siteSettings } = useAppData()
  const { openGuideModal } = useBaseModal()

  useEffect(() => {
    if (siteData) {
      initialIntercomBoot()
    }
  }, [siteData, siteSettings])

  function initialIntercomBoot() {
    boot({
      name: siteData?.siteDisplayName ?? siteSettings?.business_name,
      email: siteSettings?.email ?? siteData?.email,
      verticalPadding: 52,
      customAttributes: {
        app: APP_NAME,
        user_id: siteData?.instanceId,
        instance_id: siteData?.instanceId,
        business_name: siteSettings?.business_name ?? siteData?.siteDisplayName,
        website_url: siteData?.siteUrl,
        subscription_plan: siteData?.subscriptionPlan ?? 'Free'
      }
    })
  }

  return (
    <PageLayout
      title={APP_NAME}
      subtitle='Import products and reviews from Etsy and display them on your site'
      actionBar={
        <Box gap={2}>
          <Tooltip content="Open support center">
            <IconButton skin="inverted" onClick={() => openExternalUrl(HELP_CENTER_URL)}>
              <Icons.Help />
            </IconButton>
          </Tooltip>
          <Button suffixIcon={<Icons.Article />} onClick={() => openGuideModal()}>
            Add Widget
          </Button>
        </Box>
      }
    >
      <Page.Content>
        <AppRouter />
      </Page.Content>
    </PageLayout>
  )
}

export default withProviders(Index)
