import { useState } from 'react';

export function useTableState(defaultOrderField = 'name') {
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [search, setSearch] = useState('');
    const [orderField, setOrderField] = useState(defaultOrderField);
    const [orderDir, setOrderDir] = useState('asc');

    const handleOrderingChange = (field) => {
        if (field !== orderField) {
            setOrderField(field);
            setOrderDir('asc');
        } else if (orderDir === 'asc') {
            setOrderDir('desc');
        } else {
            setOrderField(defaultOrderField);
            setOrderDir('asc');
        }
    };

    const orderingParam = orderDir === 'desc' ? `-${orderField}` : orderField;

    return { page, setPage, pageSize, setPageSize, search, setSearch, orderField, orderDir, orderingParam, handleOrderingChange };
}