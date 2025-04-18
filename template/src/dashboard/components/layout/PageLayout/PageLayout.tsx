import React, { useState } from 'react'
import { Image, Page } from '@wix/design-system'

import { Images } from '../../../resources'
import Footer from '../Footer'
import FullScreenLoader from '../../common/FullScreenLoader'

interface PageLayoutProps {
  title: string | undefined
  subtitle?: string
  children: React.ReactNode
  actionBar?: React.ReactNode
}

const PageLayout: React.FC<PageLayoutProps> = ({ title, subtitle, children, actionBar }) => {
  const pageRef = React.createRef<Page>()
  const [isMiniHeader, setIsMiniHeader] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = (htmlElement: any) => {
    let scrollY = htmlElement?.target?.scrollTop
    if (scrollY == undefined || scrollY == null) scrollY = 79
    setIsMiniHeader(scrollY > 78)
  }

  return (
    <>
      <Page ref={pageRef} height="100vh" className="mkp-page" scrollProps={{ onScrollChanged: onScroll }}>
        <Page.Header
          title={title}
          subtitle={subtitle}
          actionsBar={actionBar}
          breadcrumbs={
            isMiniHeader ? (
              ''
            ) : (
              <Image transparent borderRadius={0} className="mkp-logo" width={118} src={Images.MKP_LOGO_MINI} />
            )
          }
        />
        {children}
      </Page>
      <Footer />
      <FullScreenLoader />
    </>
  )
}

export default PageLayout
