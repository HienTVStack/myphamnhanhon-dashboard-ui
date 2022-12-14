import { useState } from "react";
import {
    Button,
    Paper,
    Stack,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Typography,
    Modal,
    Box,
    Snackbar,
    Alert,
    Divider,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Iconify from "src/components/Iconify";
import { fDate } from "src/utils/formatTime";

import categoryApi from "src/api/categoryApi";
import ModalCreate from "./Create";
import { loadCategory } from "src/redux/actions";
import EditCategory from "./Edit";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    border: "1px solid #ccc",
    boxShadow: 24,
    p: 4,
};

function Category() {
    const dispatch = useDispatch();
    const categoryList = useSelector((state) => state.data.categoryList);
    const [loading, setLoading] = useState(false);
    const [visibleCreate, setVisibleCreate] = useState(false);
    const [visibleEdit, setVisibleEdit] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [dataCategorySelected, setDataCategorySelected] = useState({});
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });
    const handleClose = () => {
        setVisibleCreate(false);
        setVisibleEdit(false);
        setVisibleDelete(false);
    };

    const fetchCategory = async () => {
        setLoading(true);
        try {
            const res = await categoryApi.getAll();

            if (res.success) {
                console.log(res.categories);
                dispatch(loadCategory(res.categories));
            }
        } catch (error) {}
        setLoading(false);
    };

    const handleCreate = async (data) => {
        setLoading(true);
        try {
            const res = await categoryApi.create(data);

            if (res.success) {
                setToastMessage({
                    open: true,
                    type: "success",
                    message: "T???o m???i th??nh c??ng",
                });
                fetchCategory();
                setVisibleCreate(false);
            }
        } catch (error) {}
        setLoading(false);
    };

    const handleEdit = async (data) => {
        setLoading(true);
        try {
            const res = await categoryApi.update(data.id, { name: data.name, description: data.description });

            if (res.success) {
                setToastMessage({ open: true, type: "success", message: "Ch???nh s???a th??nh c??ng" });
                fetchCategory();
                setVisibleEdit(false);
            }
        } catch (error) {
            setToastMessage({ open: true, type: "error", message: "Ch???nh s???a th???t b???i" });
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const res = await categoryApi.destroy(id);

            if (res.success) {
                setToastMessage({ open: true, type: "success", message: "X??a th??nh c??ng" });
                fetchCategory();
                setVisibleDelete(false);
            }
        } catch (error) {
            setToastMessage({ open: true, type: "error", message: "X??a th???t b???i" });
        }
        setLoading(false);
    };

    return (
        <>
            <Typography variant={"subtitle1"} fontSize={24} lineHeight={"39px"}>
                Danh m???c
            </Typography>
            <Paper elevation={2}>
                <Stack spacing={2}>
                    <Button onClick={() => setVisibleCreate(true)} variant={"outlined"} startIcon={<Iconify icon={"material-symbols:add"} />}>
                        Th??m
                    </Button>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>STT</TableCell>
                                    <TableCell>T??n danh m???c</TableCell>
                                    <TableCell />
                                    <TableCell>M?? t???</TableCell>
                                    <TableCell />
                                    <TableCell>Ng??y t???o</TableCell>
                                    <TableCell align="right">H??nh ?????ng</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categoryList &&
                                    categoryList?.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell colSpan={2}>{item.name}</TableCell>
                                            <TableCell colSpan={2}>{item.description || "Ch??a c?? m?? t???"}</TableCell>
                                            <TableCell>{fDate(item.createdAt || new Date())}</TableCell>
                                            <TableCell align={"center"}>
                                                <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-end"} spacing={2}>
                                                    <Button
                                                        variant={"text"}
                                                        onClick={() => {
                                                            setDataCategorySelected(item);
                                                            setVisibleEdit(true);
                                                        }}
                                                    >
                                                        Ch???nh s???a
                                                    </Button>
                                                    <Divider orientation="vertical" flexItem />
                                                    <Button
                                                        variant={"text"}
                                                        color={"error"}
                                                        onClick={() => {
                                                            setDataCategorySelected(item);
                                                            setVisibleDelete(true);
                                                        }}
                                                    >
                                                        X??a
                                                    </Button>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Stack>
            </Paper>
            <Modal open={visibleCreate} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>T???o danh m???c s???n ph???m</Typography>

                    <Box>
                        <ModalCreate submit={handleCreate} loading={loading} />
                    </Box>
                </Box>
            </Modal>
            <Modal open={visibleEdit} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>Ch???nh s???a danh m???c</Typography>

                    <Box>
                        <EditCategory category={dataCategorySelected} submit={handleEdit} loading={loading} />
                    </Box>
                </Box>
            </Modal>
            <Modal open={visibleDelete} onClose={handleClose}>
                <Box sx={style}>
                    <Typography variant={"subtitle1"}>X??a danh m???c</Typography>
                    <Typography variant="body2">B???n c?? ch???c x??a danh m???c n??y kh??ng?</Typography>
                    <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-end"} spacing={2} mt={4}>
                        <Button color={"primary"} variant="contained" onClick={() => setVisibleDelete(false)}>
                            H???y
                        </Button>
                        <Button color={"error"} variant="contained" onClick={() => handleDelete(dataCategorySelected._id)}>
                            X??a
                        </Button>
                    </Stack>
                </Box>
            </Modal>
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
        </>
    );
}

export default Category;
