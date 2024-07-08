import React from 'react';

import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';

export default function DataTable({ state, setState, columns, getRowHeight }) {
  return (
    <>
      {state?.data?.length > 0 ? (
        <DataGrid
          rows={state.data}
          rowCount={state.total}
          loading={state.isLoading}
          pagination
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          page={state.page - 1}
          pageSize={state.pageSize}
          paginationMode="server"
          onPaginationModelChange={(newPage) => {
            setState((old) => ({
              ...old,
              page: newPage.page + 1,
              pageSize: newPage.pageSize,
            }));
          }}
          getRowId={(row) => row._id}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          getRowHeight={getRowHeight}
        />
      ) : (
        <Typography variant="body1" marginTop={5}>
          No data
        </Typography>
      )}
    </>
  );
}
