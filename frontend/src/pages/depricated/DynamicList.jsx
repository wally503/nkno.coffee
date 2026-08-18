// src/pages/brew/shared/DynamicList.jsx
//
// Generic list page for flat catalog entities. Takes a config, wires
// CoffeeTable + useTableState to the dynamic API. Mirrors how ListBeansPage
// works, but the entity is entirely config-driven (columns + uriPath).

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Fade } from '@mui/material';
import CoffeeTable from '../../components/CoffeeTable';
import PageTitle from '../../components/PageTitle';
import DefaultBodyLayout from '../../components/DefaultBodyLayout';
import { useTableState } from '../../hooks/useTableState';
import { defaultDynamicList } from '../../api/dynamicApi';

export default function DynamicList({ config }) {
  const navigate = useNavigate();
  const tableState = useTableState(config.columns[0]?.id ?? 'name');

  const [rows, setRows] = React.useState([]);
  const [totalCount, setTotalCount] = React.useState(0);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      const data = await defaultDynamicList(
        config.uriPath,
        tableState.page,
        tableState.pageSize,
        tableState.search,
        tableState.orderingParam,
      );
      if (data) {
        setRows(data.results ?? []);
        setTotalCount(data.count ?? 0);
      }
      setLoaded(true);
    };
    load().catch(console.error);
  }, [
    config.uriPath,
    tableState.page,
    tableState.pageSize,
    tableState.search,
    tableState.orderField,
    tableState.orderDir,
  ]);

  return (
    <DefaultBodyLayout>
      <PageTitle title={config.labelPlural} hasBackButton backRoute={config.hub} />

      <Box sx={{ width: '90%', maxWidth: 1400, mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" onClick={() => navigate(`${config.base}/add`)}>
          Add {config.label}
        </Button>
      </Box>

      <Fade in={loaded} timeout={400}>
        <div>
          <CoffeeTable
            columns={config.columns}
            rows={rows}
            totalCount={totalCount}
            tableState={tableState}
            viewRoute={`${config.base}/view`}
          />
        </div>
      </Fade>
    </DefaultBodyLayout>
  );
}