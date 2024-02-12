import React, { useContext } from 'react';
import { useTable, usePagination, useSortBy } from 'react-table';
import GlobalContext from '../context/GlobalContext';

export default function Tabla({ data, columns }) {
    const { API_URL } = useContext(GlobalContext);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data,
            initialState: { pageIndex: 0, pageSize: 20 },
        },
        useSortBy,
        usePagination
    );

    // Función para convertir los títulos de las columnas a mayúsculas
    const toUpperCase = str => str.toUpperCase();

    return (
        <>
            <div className="d-flex justify-content-around flex-wrap my-3">
                <div className="d-flex flex-column flex-md-row btn-group mb-2 mb-md-0">
                    <button className="btn btn-primary mb-2 mb-md-0" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                        {'<<'}
                    </button>
                    <button className="btn btn-primary mb-2 mb-md-0" onClick={() => previousPage()} disabled={!canPreviousPage}>
                        {'<'}
                    </button>
                    <button className="btn btn-primary mb-2 mb-md-0" onClick={() => nextPage()} disabled={!canNextPage}>
                        {'>'}
                    </button>
                    <button className="btn btn-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                        {'>>'}
                    </button>
                </div>
                <div className="d-flex align-items-center mb-2 mb-md-0">
                    <span>
                        Página{' '}
                        <strong>
                            {pageIndex + 1} de {pageOptions.length}
                        </strong>
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <select
                        value={pageSize}
                        onChange={e => {
                            setPageSize(Number(e.target.value));
                        }}
                        className="form-select"
                    >
                        {[5, 10, 20].map(size => (
                            <option key={size} value={size}>
                                Mostrar {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="table-responsive">
                <table {...getTableProps()} className="table table-striped table-hover">
                    <thead className="thead-dark text-center">
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                        {toUpperCase(column.render('Header'))}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' ↓' : ' ↑') : ''}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()} className='text-end'>
                        {page.map(row => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => (
                                        <td {...cell.getCellProps()}>
                                            {Array.isArray(cell.value) ? (
                                                <div>
                                                    {cell.value.map((imagen, index) => (
                                                        <img key={index} src={`${API_URL}/static/images/${imagen.nombre_imagen}`} alt={imagen.nombre_imagen} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                                    ))}
                                                </div>
                                            ) : (
                                                cell.render('Cell')
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}
