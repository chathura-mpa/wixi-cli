import React from 'react'
import { Box } from '@wix/design-system'
import { ShimmerDiv } from 'shimmer-effects-react'

type DivShimmerProps = {
  height?: number | string
  width?: number | string
  rounded?: number
  marginBottom?: number
  marginTop?: number
}

const DivShimmer = ({ height, width, rounded, marginBottom = 0, marginTop = 0 }: DivShimmerProps) => {
  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <ShimmerDiv
        mode="custom"
        height={height ?? 11}
        width={width ?? 180}
        rounded={rounded ?? 6}
        from="#ECEFF3"
        via="#DFE5EB"
        to="#ECEFF3"
      />
    </Box>
  )
}

export default DivShimmer
