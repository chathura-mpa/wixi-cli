import React from 'react'
import { Box, Loader, SkeletonGroup, SkeletonLine, SkeletonRectangle, Text, Tooltip } from '@wix/design-system'
import * as Icons from '@wix/wix-ui-icons-common'

import { SPACING } from '../../../styles'
import classes from './StatsCard.module.scss'

export interface MiniCardProps {
  label: string
  value?: number | string
  isLoading?: boolean
  cardSize?: 'small' | 'medium'
  tooltip?: string
}

const MiniCard = ({ label = 'No Label', value = '-', cardSize = 'small', isLoading = false, tooltip = '' }: MiniCardProps) => {
  if (isLoading) {
    return (
      <div className={cardSize == 'small' ? classes['card'] : undefined}>
        <SkeletonGroup>
          <Box direction="vertical">
            <Box verticalAlign="middle" marginBottom={SPACING.x12}>
              <SkeletonLine width={150} />
            </Box>
            <Box verticalAlign="middle" direction="vertical" gap={2}>
              <SkeletonRectangle width={24} height={24} />
            </Box>
          </Box>
        </SkeletonGroup>
      </div>
    )
  }

  return (
    <div className={cardSize == 'small' ? classes.card : undefined}>
      <Box direction="vertical">
        <Box gap={1}>
          <Text size="tiny">{label}</Text>
          {tooltip ? (
            <Tooltip inline content={tooltip} maxWidth={360}>
              <Icons.InfoCircleSmall color="#116DFF" />
            </Tooltip>
          ) : (
            <Box height={24} />
          )}
        </Box>
        <Box verticalAlign="middle">
          <Box>
            <Text size="medium" weight="bold" className={classes[cardSize == 'small' ? 'medium-plus' : 'large-font']}>
              {isLoading ? <Loader size={cardSize == 'small' ? 'tiny' : 'small'} /> : value}
            </Text>
          </Box>
        </Box>
      </Box>
    </div>
  )
}
export default MiniCard
