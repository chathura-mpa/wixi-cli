import React from 'react'
import { Box, Text } from '@wix/design-system'

import ImageMagnify from './ImageMagnify'
import classes from './StepCard.module.scss'

export interface StepCardProps {
  image: string
  title: string
  explain?: string
  steps?: React.ReactNode[] | null
}

const StepCard: React.FC<StepCardProps> = ({ image = '-', title = '-', explain = '-', steps = null }) => {
  return (
    <Box width="100%" gap="12px">
      <Box
        gap="8px"
        width="240px"
        height="212px"
        overflow="hidden"
        borderRadius="8px"
        border={`1px solid var(--wsr-color-D70, #eceff3)`}
      >
        <ImageMagnify src={image} width={240} height={212} magnificationFactor={2} />
      </Box>
      <Box gap="4px" direction="vertical" padding="12px 24px" flex={1}>
        <Box gap="4px" direction="vertical">
          <Text size="medium" weight="bold">
            {title}
          </Text>
          <Text size="medium">{explain}</Text>
        </Box>
        {steps && steps.length > 0 && (
          <Text size="medium" className={classes['medium-low']}>
            <ol className={classes['align-ol-list']}>
              {steps.map((step, i) => (
                <li key={`${step?.toString()}-${i}`}>{step}</li>
              ))}
            </ol>
          </Text>
        )}
      </Box>
    </Box>
  )
}

export default StepCard
