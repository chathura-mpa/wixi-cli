import React from 'react'
import { Box, Card, Cell, Heading, Layout, Text, SkeletonGroup, SkeletonRectangle, Tooltip } from '@wix/design-system'
import StatsRangeSelector from '../StatsRangeSelector'
import MiniCard from '../../common/MiniCard'
import RefreshButton from '../RefreshButton'
import { SPACING } from '../../../styles'
import classes from './Statistics.module.scss'
import { WixIcons } from '../../../resources'
import StackCard from '../../common/StackCard'

type Props = {
    // locale: any
    // currency: any
}

const useStatisticsHook = () => {
    const [loading, setLoading] = React.useState(false)
    const [statistics, setStatistics] = React.useState({
        reviewsImportedToApprovedReviews: 0,
        productsFromEtsy: 0,
        nrOfReviewsImported: 0,
        productsConnectedToEtsyReviews: 0,
        nrOfReviewsApproved: 0,
    })

    const [selectedFilter, setSelectedFilter] = React.useState(0)

    const getStatistics = async (selectedFilter: number) => {
        try {
            setLoading(true)
            const data = {
                reviewsImportedToApprovedReviews: 87.68,
                productsFromEtsy: 25,
                nrOfReviewsImported: 654,
                productsConnectedToEtsyReviews: 15,
                nrOfReviewsApproved: 547,
            }
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setStatistics(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    React.useEffect(() => {
        getStatistics(selectedFilter)
        return () => { }
    }, [selectedFilter])

    return {
        loading,
        statistics,
        selectedFilter,
        setSelectedFilter,
        getStatistics
    }
}

const Statistics = ({ }: Props) => {
    const { loading, statistics, selectedFilter, setSelectedFilter, getStatistics } = useStatisticsHook()

    const stack1 = [
        {
            title: 'Products Imported from Etsy',
            tooltip: 'Total number of products successfully imported from your Etsy store',
            value: statistics?.productsFromEtsy,
        },
        {
            title: 'Nr of Reviews Imported',
            tooltip: 'Total number of reviews successfully imported from your Etsy store',
            value: statistics?.nrOfReviewsImported,
        },
        // Removed duplicate entry
    ]

    const stack2 = [
        {
            title: 'Products Connected to Etsy Reviews',
            tooltip: 'Total number of products successfully imported from your Etsy store',
            value: statistics?.productsConnectedToEtsyReviews,
        },
        {
            title: 'Nr of Reviews Approved',
            tooltip: 'Total number of imported reviews that have been approved and published',
            value: statistics?.nrOfReviewsApproved,
        },
    ]

    return (
        <Box direction='vertical' gap={3}>
            <Box direction='vertical' marginTop={SPACING.x12}>
                <Heading size="medium">Statistics</Heading>
                <Text size='small'>Etsy reviews and product import summary</Text>
            </Box>

            <Card stretchVertically>
                <Card.Content size="medium">
                    <Layout>
                        <Cell span={4}>
                            <Box align='space-between' height={'100%'} direction='vertical' paddingTop={SPACING.x12}>
                                <MiniCard
                                    isLoading={loading}
                                    cardSize="medium"
                                    label={'Nr of Reviews Imported to Nr of Reviews Approved'}
                                    value={statistics?.reviewsImportedToApprovedReviews}
                                    tooltip='Percentage of imported reviews that have been approved'
                                />
                                <RefreshButton onClick={() => getStatistics(selectedFilter)} />
                            </Box>
                        </Cell>

                        <Cell span={4}>
                            <Box className={classes['stack-card']} direction='vertical'>
                                {stack1.map((item, index) => (
                                    <Box
                                        key={index}
                                        borderBottom={index === stack1.length - 1 ? undefined : "1px solid #E5E7EB"}
                                    >
                                        <StackCard loading={loading} data={item} />
                                    </Box>
                                ))}
                            </Box>
                        </Cell>

                        <Cell span={4}>
                            <Box className={classes['stack-card']} direction='vertical'>
                                {stack2.map((item, index) => (
                                    <Box
                                        key={index}
                                        borderBottom={index === stack2.length - 1 ? undefined : "1px solid #E5E7EB"}
                                    >
                                        <StackCard loading={loading} data={item} />
                                    </Box>
                                ))}
                            </Box>
                        </Cell>
                    </Layout>
                </Card.Content>
            </Card>
        </Box>
    )
}

export default Statistics