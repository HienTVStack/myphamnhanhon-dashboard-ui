import { filter } from "lodash";
// import { sentenceCase } from "change-case";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// material
import {
    Card,
    Table,
    Stack,
    Avatar,
    Button,
    Checkbox,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Snackbar,
    Alert,
} from "@mui/material";
// components
import Page from "src/components/Page";
import Label from "src/components/Label";
import Scrollbar from "src/components/Scrollbar";
import Iconify from "src/components/Iconify";
import SearchNotFound from "src/components/SearchNotFound";
import { UserListHead } from "src/sections/@dashboard/user";
import { ProductListToolbar } from "src/sections/@dashboard/products";
// mock
import productApi from "src/api/productApi";
import { NumericFormat } from "react-number-format";
import Loading from "src/components/Loading";
import MoreMenuProduct from "./MoreMenuProduct";
import { useEffect } from "react";
import { Fragment } from "react";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
    { id: "name", label: "Name", alignRight: false },
    { id: "createdAt", label: "Ngày tạo", alignRight: false },
    { id: "status", label: "Trạng thái", alignRight: false },
    { id: "price", label: "Giá", alignRight: false },
    { id: "quantityStock", label: "Tồn" },
    { id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    if (query) {
        return filter(array, (_product) => _product.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
    }
    return stabilizedThis.map((el) => el[0]);
}

const handleTotalQuantityStock = (list) => {
    let total = 0;
    for (const item of list) {
        total += item.quantityStock;
    }
    return total;
};

export default function ProductList() {
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState("desc");
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState("createdAt");
    const [filterName, setFilterName] = useState("");
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [productList, setProductList] = useState([]);
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR",
    });

    const fetchProductList = async () => {
        setLoading(true);
        try {
            const res = await productApi.getAll();
            if (res.message === "OK") {
                setProductList(res.products);
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProductList();
    }, []);

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = productList.map((n) => n.id);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
        }
        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleFilterByName = (event) => {
        setFilterName(event.target.value);
    };

    const handleRemoveProductItem = async (id) => {
        setLoading(true);
        try {
            const res = await productApi.destroyById(id);
            if (res.message === "OK") {
                setProductList(productList.filter((product) => product.id !== id));
                setLoading(false);
            }
            setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
        } catch (error) {
            console.log(error);
            setLoading(false);
            setToastMessage({ open: true, type: "error", message: "Có lỗi khi xóa sản phẩm" });
        }
    };

    const handleDestroyMultipleProduct = async (idList) => {
        setLoading(true);
        try {
            const res = await productApi.destroyMultiple({ idList });

            if (res.message === "OK") {
                fetchProductList();
            }
            setToastMessage({ open: true, type: "success", message: "Xóa thành công" });
        } catch (error) {
            console.log(error);
            setLoading(false);
            setToastMessage({ open: true, type: "error", message: "Có lỗi khi xóa sản phẩm" });
        }
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productList.length) : 0;

    const filteredUsers = applySortFilter(productList, getComparator(order, orderBy), filterName);

    const isUserNotFound = filteredUsers.length === 0;

    return (
        <Fragment>
            <Page title="Product">
                <Container>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                        <Typography variant="h4" gutterBottom>
                            Danh sách sản phẩm
                        </Typography>
                        <Button
                            variant="contained"
                            component={RouterLink}
                            to="/dashboard/products/create"
                            startIcon={<Iconify icon="eva:plus-fill" />}
                        >
                            Thêm mới
                        </Button>
                    </Stack>

                    <Card>
                        <ProductListToolbar
                            numSelected={selected.length}
                            filterName={filterName}
                            onFilterName={handleFilterByName}
                            productsSelected={selected}
                            destroyMultipleProduct={handleDestroyMultipleProduct}
                        />
                        {loading ? (
                            <Loading />
                        ) : (
                            <Scrollbar>
                                <TableContainer sx={{ minWidth: 800 }}>
                                    <Table>
                                        <UserListHead
                                            order={order}
                                            orderBy={orderBy}
                                            headLabel={TABLE_HEAD}
                                            rowCount={productList.length}
                                            numSelected={selected.length}
                                            onRequestSort={handleRequestSort}
                                            onSelectAllClick={handleSelectAllClick}
                                        />
                                        <TableBody>
                                            {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                                const { id, name, createdAt, image, inStock, price, type, slug } = row;
                                                const isItemSelected = selected.indexOf(id) !== -1;

                                                return (
                                                    <TableRow
                                                        hover
                                                        key={id}
                                                        tabIndex={-1}
                                                        role="checkbox"
                                                        selected={isItemSelected}
                                                        aria-checked={isItemSelected}
                                                    >
                                                        <TableCell padding="checkbox">
                                                            <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, id)} />
                                                        </TableCell>
                                                        <TableCell component="th" scope="row" padding="none">
                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                <Avatar alt={name} src={image} />
                                                                <Typography variant="subtitle2" noWrap>
                                                                    {name}
                                                                </Typography>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            {new Intl.DateTimeFormat("en-US", {
                                                                year: "numeric",
                                                                month: "2-digit",
                                                                day: "2-digit",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            }).format(new Date(createdAt))}
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <Label variant="ghost" color={handleTotalQuantityStock(type) > 0 ? "success" : "error"}>
                                                                {handleTotalQuantityStock(type) > 0 ? "Còn hàng" : "Hết hàng"}
                                                            </Label>
                                                        </TableCell>
                                                        <TableCell align="left">
                                                            <NumericFormat
                                                                value={price}
                                                                displayType={"text"}
                                                                thousandSeparator={true}
                                                                suffix={" đ"}
                                                                renderText={(value, props) => <div {...props}>{value}</div>}
                                                            />
                                                        </TableCell>
                                                        <TableCell align="center">{handleTotalQuantityStock(type)}</TableCell>

                                                        <TableCell align="right">
                                                            <MoreMenuProduct slug={slug} product={row} removeProductItem={handleRemoveProductItem} />
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                            {emptyRows > 0 && (
                                                <TableRow
                                                    style={{
                                                        height: 53 * emptyRows,
                                                    }}
                                                >
                                                    <TableCell colSpan={6} />
                                                </TableRow>
                                            )}
                                        </TableBody>

                                        {isUserNotFound && (
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                                                        <SearchNotFound searchQuery={filterName} />
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        )}
                                    </Table>
                                </TableContainer>
                            </Scrollbar>
                        )}
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            component="div"
                            count={productList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Card>
                </Container>
            </Page>
            <Snackbar
                open={toastMessage.open}
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                autoHideDuration={3000}
                onClose={() => setToastMessage({ open: false })}
            >
                <Alert variant="filled" hidden={3000} severity={toastMessage.type} x={{ minWidth: "200px" }}>
                    {toastMessage.message}
                </Alert>
            </Snackbar>
        </Fragment>
    );
}
