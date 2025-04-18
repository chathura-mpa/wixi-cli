import React, { useEffect } from 'react'
import { Page, Tabs } from '@wix/design-system'
import { useLocation, useNavigate } from 'react-router-dom'
import { AppRoute } from '../../../../interfaces'
import { ROUTES } from '../../../routes/AppRouter'

type Props = {
  routes: AppRoute[]
}

const TabNavigator = ({ routes }: Props) => {
  const location = useLocation()
  const navigate = useNavigate()

  const [activeTabId, setActiveTabId] = React.useState<number | string>(1)

  useEffect(() => {
    const currentRoute = routes.find((route) => route.path === location.pathname)
    if (currentRoute) {
      setActiveTabId(currentRoute.id)
    }
  }, [location])

  const items = routes.map((item) => {
    return { id: item.id, title: item.title }
  })

  return (
    <Page.Sticky>
      <Tabs
        alignment="start"
        size="small"
        items={items}
        type="compactSide"
        activeId={activeTabId}
        onClick={(tab) => {
          setActiveTabId(tab.id)
          const route = ROUTES.find((r) => r.id === tab.id)
          if (route) {
            navigate(route.path)
          }
        }}
      />
    </Page.Sticky>
  )
}

export default TabNavigator
