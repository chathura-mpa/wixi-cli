import React, { useMemo } from 'react'
import { Box, Page } from '@wix/design-system'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'

import { AppRoute } from '../../interfaces'
import { SPACING } from '../styles'
import TabNavigator from '../components/layout/TabNavigator'

const SamplePage = ({ title }: { title: string }) => {
    return (
        <div>
            <h1>{title}</h1>
            <p>This is a {title}.</p>
        </div>
    )
}

export const ROUTES: AppRoute[] = [
    {
        id: 1,
        title: 'Page One',
        path: '/',
        element: <SamplePage title={'Page One'} />
    },
    {
        id: 2,
        title: 'Page Two',
        path: '/two',
        element: <SamplePage title={'Page Two'} />
    }

]

const AppRouter = () => {
    const updatedRoutes = useMemo(
        () =>
            ROUTES.map((route) => ({
                ...route,
            })),
        []
    )

    return (
        <HashRouter>
            <TabNavigator routes={updatedRoutes} />
            <Page.Content>
                <Box marginTop={SPACING.x12}>
                    <Routes>
                        {updatedRoutes.map((route) => (
                            <Route key={route.id} path={route.path} element={route.element} />
                        ))}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Box>
            </Page.Content>
        </HashRouter>
    )
}

export default AppRouter
