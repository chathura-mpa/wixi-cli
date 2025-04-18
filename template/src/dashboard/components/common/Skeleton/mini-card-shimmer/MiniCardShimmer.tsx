import React from 'react'
import { Box } from '@wix/design-system'

import { SPACING } from '../../../../styles'
import DivShimmer from '../div-shimmer'
import classes from './MiniCardShimmer.module.scss'

type MiniCardShimmerProps = {
  cardSize?: 'small' | 'medium'
  rows?: number
}

const MiniCardShimmer = ({ cardSize = 'small', rows = 1 }: MiniCardShimmerProps) => {
  const rowsArray = Array.from({ length: rows }).map((_, i) => (
    <DivShimmer key={`shimmer-${cardSize}-${i}`} width={'25%'} height={20} />
  ))

  return (
    <div className={cardSize == 'small' ? classes.card : undefined}>
      <Box direction="vertical">
        <Box verticalAlign="middle" marginBottom={SPACING.x12}>
          <DivShimmer />
        </Box>
        <Box verticalAlign="middle" direction="vertical" gap={2}>
          {rowsArray}
        </Box>
      </Box>
    </div>
  )
}

export default MiniCardShimmer
