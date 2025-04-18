import React from 'react';
import { Box, Card, IconButton, Search, Table, TableColumn, TableToolbar, Text } from '@wix/design-system';
import { WixIcons } from '../../../resources';
import { orderBy } from 'lodash';

type Props = {
    auctions: any[];
};

type FilterState = {
    search: string;
    sort: {
        fieldName: string;
        order: 'desc' | 'asc';
    };
};

const TopReviewedProductsTable = ({ }: Props) => {
    const [filters, setFilters] = React.useState<FilterState>({
        search: '',
        sort: {
            fieldName: 'totalReviews',
            order: 'desc',
        },
    });

    const topReviewedProducts = React.useMemo(() => [
        {
            name: 'Product 1',
            totalReviews: 5,
            acceptedReviews: 2,
            rejectedReviews: 3
        },
        {
            name: 'Product 2',
            totalReviews: 10,
            acceptedReviews: 5,
            rejectedReviews: 5
        }
    ], []);

    const _toggleSortOrder = (fieldName: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            sort: {
                fieldName,
                order: prevFilters.sort.fieldName === fieldName && prevFilters.sort.order === 'asc' ? 'desc' : 'asc',
            },
        }));
    };

    const handleSortClick = (colData: TableColumn) => {
        if (colData.sortable && colData.id) {
            _toggleSortOrder(colData.id);
        }
    };

    const getFilteredData = () => {
        const filteredData = topReviewedProducts
            .map((item) => ({
                ...item,
                name: item.name ?? 'Missing/Deleted Product',
                totalReviews: item.totalReviews ?? 0,
                acceptedReviews: item.acceptedReviews ?? 0,
                rejectedReviews: item.rejectedReviews ?? 0,
            }))
            .filter((record) =>
                record.name.toLowerCase().includes(filters.search.toLowerCase())
            );

        return orderBy(filteredData, [filters.sort.fieldName], [filters.sort.order]);
    };

    const filteredData = getFilteredData();

    const columns = React.useMemo(
        () => [
            {
                id: 'image',
                title: '',
                width: 60,
                render: () => (
                    <Box width={42} height={42} borderRadius={6} backgroundColor="#f2f2f2" />
                ),
            },
            {
                id: 'name',
                title: 'Product Name',
                render: (item) => (
                    <Box direction="vertical" gap={1}>
                        <Text size="small" ellipsis>
                            {item.name}
                        </Text>
                        <Box direction="horizontal" gap={2}>
                            {item.sku && <Text size="tiny">SKU: {item.sku}</Text>}
                            {item.price && <Text size="tiny">Price: ${item.price.toFixed(2)}</Text>}
                        </Box>
                    </Box>
                ),
            },
            {
                id: 'totalReviews',
                title: 'Total Reviews',
                sortable: true,
                sortDescending: filters.sort.fieldName === 'totalReviews' && filters.sort.order === 'desc',
                render: (item) => <Text size="small">{item.totalReviews}</Text>,
            },
            {
                id: 'acceptedReviews',
                title: 'Accepted Reviews',
                sortable: true,
                sortDescending: filters.sort.fieldName === 'acceptedReviews' && filters.sort.order === 'desc',
                render: (item) => <Text size="small">{item.acceptedReviews}</Text>,
            },
            {
                id: 'rejectedReviews',
                title: 'Rejected Reviews',
                sortable: true,
                sortDescending: filters.sort.fieldName === 'rejectedReviews' && filters.sort.order === 'desc',
                render: (item) => <Text size="small">{item.rejectedReviews}</Text>,
            },
        ],
        [filters.sort.fieldName, filters.sort.order]
    );

    return (
        <Card hideOverflow>
            <Table data={filteredData} columns={columns} onSortClick={handleSortClick}>
                <TableToolbar>
                    <TableToolbar.Title>Top Reviewed Products</TableToolbar.Title>
                    <TableToolbar.ItemGroup position="end">
                        <TableToolbar.Item>
                            <IconButton
                                skin="standard"
                                priority="secondary"
                                size="small"
                                onClick={() => { }}
                            >
                                <WixIcons.Refresh />
                            </IconButton>
                        </TableToolbar.Item>
                        <TableToolbar.Item>
                            <Search
                                size="small"
                                value={filters.search}
                                onChange={(event) =>
                                    setFilters((prev) => ({ ...prev, search: event.target.value }))
                                }
                                onClear={() => setFilters((prev) => ({ ...prev, search: '' }))}
                                placeholder="Search products..."
                            />
                        </TableToolbar.Item>
                    </TableToolbar.ItemGroup>
                </TableToolbar>
                <Table.Content />
            </Table>
        </Card>
    );
};

export default TopReviewedProductsTable;