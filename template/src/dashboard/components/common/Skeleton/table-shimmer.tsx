import React from 'react'
import { Table, TableToolbar } from '@wix/design-system'

import DivShimmer from './div-shimmer'

type TableShimmerProps = {
  rows?: number
  columns?: number
}

const TableShimmer = ({ rows = 5, columns = 3 }: TableShimmerProps) => {
  const columnsArray = Array.from({ length: columns }).map(() => ({
    title: '',
    render: () => <DivShimmer width={'100%'} />
  }))

  const rowsArray = Array.from({ length: rows }).map(() => ({
    title: '',
    render: () => <DivShimmer width={'100%'} />
  }))

  return (
    <Table data={rowsArray} columns={columnsArray} rowVerticalPadding="medium" width="100%">
      <TableToolbar>
        <TableToolbar.ItemGroup position="start">
          <TableToolbar.Item>
            <TableToolbar.Title>
              <DivShimmer height={25} width={150} />
            </TableToolbar.Title>
          </TableToolbar.Item>
        </TableToolbar.ItemGroup>
      </TableToolbar>
      <Table.Content titleBarVisible={false} />
    </Table>
  )
}

export default TableShimmer
