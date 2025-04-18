import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { Box, Loader } from '@wix/design-system'

import { WixSiteData } from '../../interfaces'
import { getWixSiteData, requestFetchSettings, requestUpdateSetSettings, updateInstance } from '../services/site-data'
import { echo } from '../utils/logger'

interface AppDataContextProps {
  siteData: WixSiteData | null
  siteSettings: Record<string, any> | null
  setSiteData: React.Dispatch<React.SetStateAction<WixSiteData | null>>
  setSiteSettings: React.Dispatch<React.SetStateAction<object | null>>
  loadSiteSettings: () => void
  updateModuleSetting: <T extends string>(field: T, value: unknown) => Promise<void>
  updateSiteSettings: (body: Partial<object>) => Promise<void>
}

const AppDataContext = createContext<AppDataContextProps | undefined>(undefined)

export const useAppData = () => {
  const context = useContext(AppDataContext)
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider')
  }
  return context
}

interface AppDataProviderProps {
  children: ReactNode
}

export const AppDataProvider: React.FC<AppDataProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true)
  const [siteData, setSiteData] = useState<WixSiteData | null>(null)
  const [siteSettings, setSiteSettings] = useState<object | null>(null)
  const [instanceError, setInstanceError] = useState<string | null>(null)
  const [siteDataError, setSiteDataError] = useState<string | null>(null)
  const [siteSettingsError, setSiteSettingsError] = useState<string | null>(null)

  const updateServerInstance = async () => {
    try {
      const response = await updateInstance()
      if (response.code === 201) {
        setInstanceError(null)
        echo.log('Instance updated successfully')
      }
    } catch (e) {
      setInstanceError('Failed to update instance.')
    }
  }

  const loadSiteData = async () => {
    try {
      const siteData = await getWixSiteData()
      echo.log('site data =>', siteData)
      setSiteData(siteData)
      setSiteDataError(null)
    } catch (error) {
      setSiteDataError('Failed to load site data.')
    }
  }

  const loadSiteSettings = async () => {
    try {
      const siteSettings = await requestFetchSettings()
      setSiteSettings(siteSettings.data.data)
      setSiteDataError(null)
    } catch (error) {
      setSiteSettingsError('Failed to load site settings.')
    }
  }

  const updateSiteSettings = async (body: Partial<object>) => {
    try {
      const { code } = await requestUpdateSetSettings(body)
      if (code === 200) {
        await loadSiteSettings()
      }
    } catch (error) {
      setSiteSettingsError('Failed to update site settings.')
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      await updateServerInstance()
      await loadSiteData()
      await loadSiteSettings()
    } catch (error) {
      echo.log('error', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const updateModuleSetting = async <T extends string>(field: T, value: unknown) => {
    setSiteSettings((prevSettings) => ({
      ...(prevSettings || {}),
      [field]: value
    }))
  }

  const contextValue = useMemo(
    () => ({
      loading,
      siteData,
      siteSettings,
      setSiteData,
      setSiteSettings,
      loadSiteSettings,
      updateModuleSetting,
      updateSiteSettings
    }),
    [loading, siteData, siteSettings]
  )

  // const errorOptions = useMemo(() => {
  //   const errorMessages = [
  //     { error: instanceError, label: 'Instance Error', description: 'Failed to update instance.' },
  //     { error: siteDataError, label: 'Site Data Error', description: 'Failed to load site data.' },
  //     { error: siteSettingsError, label: 'Site Settings Error', description: 'Failed to load site settings.' }
  //   ]

  //   return errorMessages
  //     .filter(({ error }) => error)
  //     .map(({ error, label, description }) => ({
  //       error,
  //       label,
  //       description
  //     }))
  // }, [instanceError, siteDataError, siteSettingsError])

  if (loading) {
    return (
      <Box flex={1} height="100vh" align="center" verticalAlign="middle">
        <Loader size="medium" />
      </Box>
    )
  }

  // if (!loading && errorOptions.length) {
  //   return (
  //     <Box flex={1} height="100vh" align="center" verticalAlign="middle" direction="vertical">
  //       <Card>
  //         <Card.Content>
  //           <Layout>
  //             {errorOptions.length &&
  //               errorOptions.map((option, index) => (
  //                 <Cell key={index}>
  //                   <Box border={`1px solid var(--wsr-color-D70, #eceff3)`} minWidth='500px' verticalAlign='middle' align='space-between'>
  //                     <Box
  //                       direction='vertical'
  //                       padding={2}
  //                     >
  //                       <Heading size="tiny">{option.label}</Heading>
  //                       <Heading size="extraTiny">{option.error}</Heading>
  //                     </Box>
  //                     <Box padding={2}>
  //                       <Icons.API />
  //                     </Box>
  //                   </Box>
  //                 </Cell>
  //               ))
  //             }
  //             <Cell>
  //               <Box width='100%' align='right'>
  //                 <Button size='small' onClick={loadData}>Retry</Button>
  //               </Box>
  //             </Cell>
  //           </Layout>
  //         </Card.Content>
  //       </Card>
  //     </Box>
  //   )
  // }

  return <AppDataContext.Provider value={contextValue}>{children}</AppDataContext.Provider>
}
