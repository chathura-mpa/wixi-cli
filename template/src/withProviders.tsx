/* eslint-disable @typescript-eslint/no-empty-object-type */
import React from 'react'

import { WixDesignSystemProvider } from '@wix/design-system'
import { IntercomProvider } from 'react-use-intercom'
import { Provider } from 'react-redux';

import 'moment-timezone'
import '@wix/design-system/styles.global.css'

import { INTERCOM_APP_ID } from './constants'
import { AppDataProvider } from './dashboard/contexts/AppDataProvider'
import { NotificationProvider } from './dashboard/contexts/NotificationProvider'

import './dashboard/styles/global.scss'
import { store } from './dashboard/store';
import { BaseModalProvider } from './dashboard/contexts/BaseModalProvider';
import { SidePanelProvider } from './dashboard/contexts/SidePanelProvider';

export function withProviders<P extends {} = {}>(Component: React.FC<P>) {
  return function DashboardProviders(props: P) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Provider store={store}>
          <NotificationProvider>
            <AppDataProvider>
              <IntercomProvider appId={INTERCOM_APP_ID}>
                <BaseModalProvider>
                  <SidePanelProvider>
                    <Component {...props} />
                  </SidePanelProvider>
                </BaseModalProvider>
              </IntercomProvider>
            </AppDataProvider>
          </NotificationProvider>
        </Provider>
      </WixDesignSystemProvider>
    )
  }
}
