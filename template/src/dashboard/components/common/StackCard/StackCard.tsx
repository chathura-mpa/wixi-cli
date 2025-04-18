import React from 'react'
import { Box, Tooltip, Text, SkeletonRectangle, SkeletonLine } from '@wix/design-system';
import { SPACING } from '../../../styles';
import { WixIcons } from '../../../resources';
import classes from './StackCard.module.scss'

type Props = {
    loading?: boolean;
    data: {
        title: string;
        tooltip: string;
        value: number;
    }
}

const StackCard = ({ data, loading = true }: Props) => {
    return (
        <Box direction="vertical" width="100%">
            <Box
                direction="vertical"
                marginTop={SPACING.x12}
                marginLeft={SPACING.x12}
            >
                <Box gap={1}>
                    {loading ? <SkeletonLine width={200} /> : <Text size="tiny">{data.title}</Text>}
                    {!loading ? <Tooltip inline content={data.tooltip} maxWidth={360}>
                        <WixIcons.InfoCircleSmall color="#116DFF" />
                    </Tooltip> : <Box height={24} />
                    }
                </Box>
                <Box marginBottom={SPACING.x12}>
                    {
                        loading ?
                            <SkeletonRectangle width={24} height={24} /> :
                            <Text size="medium" weight="bold">
                                {data.value || '-'}
                            </Text>
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default StackCard