import React from 'react'
import { Box, Dropdown, Text } from '@wix/design-system'
import moment from 'moment-timezone'

// Helper to calculate the start date based on a range in days
const getRangeStartDate = (range: number) => {
  return new Date(Date.now() - range * 24 * 60 * 60 * 1000)
}

export enum StatsRangeFilter {
  WEEK = '7',
  TWO_WEEKS = '14',
  MONTH = '30',
  THREE_MONTHS = '90',
  ALL = 'ALL'
}

// Define the time range options with both value and date range (start date and end date)
export const TIME_RANGE_OPTIONS = [
  {
    id: 0,
    value: 'All time',
    startDate: new Date(0),
    endDate: new Date(),
    range: StatsRangeFilter.ALL
  },
  {
    id: 1,
    value: 'Last 7 days',
    startDate: getRangeStartDate(7),
    endDate: new Date(),
    range: StatsRangeFilter.WEEK
  },
  {
    id: 2,

    value: 'Last 30 days',
    startDate: getRangeStartDate(30),
    endDate: new Date(),
    range: StatsRangeFilter.MONTH
  },
  {
    id: 3,
    value: 'Last 90 days',
    startDate: getRangeStartDate(90),
    endDate: new Date(),
    range: StatsRangeFilter.THREE_MONTHS

  }
]

// Use moment.js to format the date as 'MMM D, YYYY'
const formatDate = (date: Date) => {
  return moment(date).format('MMM D, YYYY')
}

const StatsRangeSelector: React.FC<{
  onClick: (id: number) => void
  selectedFilterId: number
  disabled?: boolean
}> = (props) => {
  const handleOnChange = (id: string | number) => {
    props.onClick(+id)
  }

  const selectedOption = TIME_RANGE_OPTIONS.find((option) => option.id === props.selectedFilterId)

  const startDate = selectedOption?.startDate
  const endDate = selectedOption?.endDate

  const currentRangeText = `(${moment(startDate).format('MMM D')} - ${formatDate(endDate!)})`

  return (
    <Box align="center" verticalAlign="middle" gap={1}>
      <Text size="small">Compared to previous period {currentRangeText}</Text>

      <Dropdown
        size="small"
        placeholder="Medium"
        dropdownWidth="auto"
        selectedId={props.selectedFilterId ?? 0}
        onSelect={(option) => handleOnChange(option.id)}
        options={TIME_RANGE_OPTIONS}
        disabled={props.disabled}
      />
    </Box>
  )
}

export default StatsRangeSelector
