import React from 'react'
import { Box, Image, Text } from '@wix/design-system'

import { Images } from '../../../resources'

interface EmptyStateProps {
  message?: string
}

const _renderEmptyState = ({ message = 'No products found' }: EmptyStateProps = {}) => {
  console.log('render empty state')
  return (
    <Box height={'100%'} verticalAlign="middle" align="center" direction="vertical" width={'100%'}>
      <Image height={120} width={120} src={Images.STATE_NODATA} transparent />
      <Text weight="bold">{message}</Text>
    </Box>
  )
}

export default _renderEmptyState
