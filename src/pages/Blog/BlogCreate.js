import {
    Box,
    Breadcrumbs,
    Stack,
    Typography,
    Link,
    Grid,
    Paper,
    TextField,
    FormControlLabel,
    Switch,
    Button,
    FormControl,
    Autocomplete,
    Checkbox,
    Backdrop,
    CircularProgress,
    FormLabel,
    ImageList,
    ImageListItem,
    Snackbar,
    Alert,
    IconButton,
} from "@mui/material";
import { Editor } from "@tinymce/tinymce-react";
import { Icon } from "@iconify/react";
import { Fragment, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import tagApi from "src/api/tagApi";
import { useDispatch, useSelector } from "react-redux";
import blogApi from "src/api/blogApi";

const preUrls = [
    {
        preUrl: "/",
        title: "Dashboard",
    },
    {
        preUrl: "/products",
        title: "Bài viết",
    },
    {
        preUrl: "/create",
        title: "Tạo mới",
    },
];

const breadcrumbs = preUrls.map((pre, index) => (
    <Link key={index} underline="hover" color="inherit" href={pre.preUrl}>
        {pre.title}
    </Link>
));

function BlogCreate() {
    const descriptionRef = useRef();
    const detailRef = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tagList = useSelector((state) => state.data.tagList);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState({
        open: false,
        type: "error",
        message: "ERR_001",
    });

    // data
    const [descriptionContent, setDescriptionContent] = useState("");
    const [detailContent, setDetailContent] = useState("");

    const [tags, setTags] = useState([]);
    const [tagAdd, setTagAdd] = useState("");
    const [tagAddErr, setTagAddErr] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const [uploadImages, setUploadImages] = useState([]);
    const [imageUploadUrl, setImageUploadUrl] = useState([]);
    // err
    const [detailContentErr, setDetailContentErr] = useState("");
    const [descriptionContentErr, setDescriptionContentErr] = useState("");
    const [nameErr, setNameErr] = useState("");

    //  Handle show image UI
    const handleSelectImage = (e) => {
        const selectedFiles = e.target.files;
        const selectedFilesArray = Array.from(selectedFiles);
        const arrayRequest = uploadImages;

        // Convert list file upload
        const arrConvert = [];
        selectedFilesArray.forEach((file) => {
            arrConvert.push({ key: Math.random(), file });
        });
        arrayRequest.push(...arrConvert);

        setUploadImages(arrayRequest);

        const imageArray = arrayRequest.map((img) => {
            return { key: img.key, url: URL.createObjectURL(img.file) };
        });

        setSelectedImages(imageArray);
    };

    // Handle upload image
    const handleUploadImage = async (e) => {
        setLoading(true);
        const imageUrl = [];
        const data = new FormData();
        for (const file of uploadImages) {
            data.append("file", file.file);
            data.append("upload_preset", "iwn62ygb");
            try {
                const res = await axios.post("https://api.cloudinary.com/v1_1/diitw1fjj/image/upload", data);
                imageUrl.push(res.data.secure_url);
                setToastMessage({
                    open: true,
                    type: "success",
                    message: "Tải ảnh thành công",
                });
            } catch (error) {
                console.log(error);
                setLoading(false);
                setToastMessage({
                    open: true,
                    type: "error",
                    message: "Tải ảnh thất bại",
                });
            }
        }
        setImageUploadUrl(imageUrl);
        setLoading(false);
        // setIsUpload(true);
    };

    const handleRemoveImageUpload = (image) => {
        setSelectedImages(selectedImages.filter((e) => e.key !== image.key));
        setUploadImages(uploadImages.filter((e) => e.key !== image.key));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setNameErr("");
        setDescriptionContentErr("");
        setLoading(true);
        const data = new FormData(e.target);

        const title = data.get("title");
        const isPublic = data.get("isPublic");
        const isReview = data.get("isReview");
        const metaTitle = data.get("metaTitle");
        const metaDescription = data.get("metaDescription");

        let err = false;
        if (title === "") {
            err = true;
            setNameErr(`Hãy nhập tên sản phẩm`);
        }

        if (descriptionContent === "") {
            err = true;
            setDescriptionContentErr("Nhập mô tả cho sản phẩm");
        }

        if (detailContent === "") {
            err = true;
            setDetailContentErr("Nhập mô tả chi tiết cho sản phẩm");
        }

        if (imageUploadUrl.length <= 0) {
            err = true;
            setToastMessage({
                open: true,
                type: "warning",
                message: "Warning! Chú ý bạn chưa tải ảnh lên could",
            });
        }

        setLoading(false);

        if (err) {
            setToastMessage({
                open: true,
                type: "warning",
                message: "Vui lòng nhập đầy đủ thông tin",
            });
            return;
        }

        setLoading(true);

        try {
            const res = await blogApi.create({
                title,
                description: descriptionContent,
                content: detailContent,
                isPublic,
                isReview,
                tags,
                image: imageUploadUrl[0],
                metaTitle,
                metaDescription,
            });
            if (res.message === "OK") {
                // dispatch(addProduct(res.product));
                navigate("/dashboard/blog/list");
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            const errors = error.data.errors[0].msg;
            if (errors) {
                setNameErr(errors);
            }
            setToastMessage({ open: true, type: "error", message: `Kiểm tra lại` });
            setLoading(false);
        }
    };

    const handleCreateTag = async () => {
        setLoading(true);
        setTagAddErr("");
        try {
            if (tagAdd === "") {
                setLoading(false);
                return;
            }
            const res = await tagApi.create({ name: tagAdd });

            if (res.message === "OK") {
                tagList.push(res.tag);
                tags.push(res.tag);
                // dispatch(addTag(res.tag));
            }
            setTagAdd("");
            setLoading(false);
        } catch (error) {
            console.log(error);
            const errors = error.data.errors;
            console.log(errors);
            if (errors) {
                setTagAddErr(errors[0].msg);
            }
            setToastMessage({ open: true, type: "error", message: `Kiểm tra lại` });
            setLoading(false);
        }
    };

    const handleChangeTagAdd = (e) => {
        const format = /^[0-9a-zA-Z''-]{0,40}$/;

        const value = e.target.value;

        if (format.test(value)) {
            setTagAddErr("");
            setTagAdd(value);
            return true;
        } else {
            setTagAddErr("Không được nhập kí tự đặc biệt");
            return false;
        }
    };

    return (
        <Fragment>
            <Box>
                <Typography variant="h3" component="h3">
                    Tạo mới bài viết
                </Typography>
                <Stack spacing={2}>
                    <Breadcrumbs separator=">" aria-label="breadcrumb">
                        {breadcrumbs}
                    </Breadcrumbs>
                </Stack>
            </Box>
            {/* Content */}
            <Stack mt={3}>
                <Grid container spacing={3} component={"form"} noValidate onSubmit={handleSubmit}>
                    <Grid item xs={12} md={8}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4} mb={4}>
                                <TextField
                                    placeholder="Tiêu đề bài viết"
                                    label="Tiêu đề bài viết"
                                    name={"title"}
                                    id={"title"}
                                    required
                                    fullWidth
                                    disabled={loading}
                                    helperText={nameErr}
                                    error={nameErr !== ""}
                                />

                                <FormControl sx={{ margin: "16px 0" }} fullWidth>
                                    <FormLabel>Mô tả*</FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        onInit={(e, editor) => (descriptionRef.current = editor)}
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            max_height: 200,
                                            plugins: "link image code",
                                        }}
                                        onChange={(e) => setDescriptionContent(descriptionRef.current.getContent())}
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography variant="body2" color="error" fontSize={"0.75rem"} sx={{ margin: "3px 14px 0 14px" }}>
                                            {descriptionContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl sx={{ margin: "16px 0" }} fullWidth>
                                    <FormLabel>Mô tả chi tiết*</FormLabel>
                                    <Editor
                                        apiKey="xcpm3lsqinf0dc322yb7650lq0koqilbdsxq3fzx6rgz59y8"
                                        plugins={"code"}
                                        onInit={(e, editor) => (detailRef.current = editor)}
                                        init={{
                                            selector: "textarea",
                                            menubar: false,
                                            plugins: "link image code",
                                            toolbar:
                                                "undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code",
                                        }}
                                        onChange={(e) => setDetailContent(detailRef.current.getContent())}
                                    />
                                    {!!descriptionContentErr && (
                                        <Typography variant="body2" color="error" fontSize={"0.75rem"} sx={{ margin: "3px 14px 0 14px" }}>
                                            {detailContentErr}
                                        </Typography>
                                    )}
                                </FormControl>

                                <FormControl fullWidth>
                                    <FormLabel htmlFor="images">+ Add image</FormLabel>
                                    <Box fullWidth aria-label="upload picture" component="label" sx={{ cursor: "pointer" }}>
                                        <input hidden accept="image/*" type="file" onChange={handleSelectImage} />
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent={"center"}
                                            sx={{
                                                height: "100%",
                                                backgroundColor: "rgb(244, 246, 248)",
                                                borderRadius: "12px",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    fontSize: "70px",
                                                    color: "#F0BD71",
                                                    margin: "0 30px",
                                                }}
                                            >
                                                <Icon icon="akar-icons:cloud-upload" />
                                            </Box>
                                            <Stack sx={{ margin: "0 20px" }}>
                                                <Typography variant="body2" color="primary" fontSize="20px" component={"h5"} gutterBottom>
                                                    Kéo hoặc chọn tệp
                                                </Typography>
                                                <Typography variant="body2" color="primary" fontSize="14px">
                                                    Thả tệp vào đây hoặc nhấp vào browser máy của bạn
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Box>
                                    <ImageList cols={5}>
                                        {!!selectedImages &&
                                            selectedImages.map((image) => (
                                                <Box key={image.key}>
                                                    <ImageListItem
                                                        sx={{
                                                            margin: "12px",
                                                        }}
                                                    >
                                                        <img
                                                            src={image.url}
                                                            alt={image}
                                                            style={{
                                                                height: "100px",
                                                                objectFit: "contain",
                                                            }}
                                                        />
                                                        <Button onClick={() => handleRemoveImageUpload(image)}>Xóa bỏ</Button>
                                                    </ImageListItem>
                                                </Box>
                                            ))}
                                    </ImageList>
                                    {selectedImages.length > 0 && (
                                        <Box display={"flex"} justifyContent="end" mt={4}>
                                            <Button variant="outlined" onClick={() => setSelectedImages([])}>
                                                Xóa tất cả
                                            </Button>
                                            <Button variant="contained" sx={{ marginLeft: "16px" }} onClick={handleUploadImage}>
                                                Upload image
                                            </Button>
                                        </Box>
                                    )}
                                </FormControl>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper elevation={3} sx={{ padding: "20px" }}>
                            <Box mt={4}>
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Hiển thị"
                                    labelPlacement="start"
                                    name="isPublic"
                                    id={"isPublic"}
                                    sx={{ width: "100%", justifyContent: "space-between" }}
                                />
                                <br />
                                <FormControlLabel
                                    control={<Switch defaultChecked />}
                                    label="Cho phép bình luận"
                                    labelPlacement="start"
                                    name="isReview"
                                    id={"isReview"}
                                    sx={{ width: "100%", justifyContent: "space-between" }}
                                />

                                <Autocomplete
                                    autoComplete
                                    fullWidth
                                    multiple
                                    options={tagList}
                                    disableCloseOnSelect
                                    getOptionLabel={(option) => option.name}
                                    isOptionEqualToValue={(option, value) => option.name === value.name}
                                    onChange={(e, value) => setTags(value)}
                                    renderOption={(props, option, { selected }) => (
                                        <li {...props}>
                                            <Checkbox
                                                icon={<Icon icon="bx:checkbox" />}
                                                checkedIcon={<Icon icon="bx:checkbox-checked" />}
                                                style={{ marginRight: 8 }}
                                                checked={selected}
                                            />
                                            {option.name}
                                        </li>
                                    )}
                                    renderInput={(params) => <TextField {...params} label="Tags" />}
                                />
                                <Typography variant="body2" component={"h4"} color={"primary"} fontSize={"16px"} mt={2}>
                                    Thêm mới thẻ
                                </Typography>
                                <Box noValidate display={"flex"} alignItems="center">
                                    <TextField
                                        label="Tags"
                                        name="tag"
                                        id="tag"
                                        margin="normal"
                                        helperText={tagAddErr}
                                        error={tagAddErr !== ""}
                                        value={tagAdd}
                                        fullWidth
                                        onChange={handleChangeTagAdd}
                                    />
                                    <IconButton
                                        color="primary"
                                        onClick={handleCreateTag}
                                        sx={{
                                            margin: "12px 0",
                                            border: "1px solid primary",
                                        }}
                                    >
                                        <Icon icon="carbon:add" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Paper>
                        <Paper elevation={3} sx={{ padding: "20px", marginTop: "20px" }}>
                            <TextField
                                placeholder="Meta title"
                                label="Meta title"
                                name={"metaTitle"}
                                id={"metaTitle"}
                                margin="normal"
                                fullWidth
                                disabled={loading}
                            />
                            <TextField
                                placeholder="Meta description"
                                label="Meta description"
                                name={"metaDescription"}
                                id={"metaDescription"}
                                fullWidth
                                disabled={loading}
                                margin="normal"
                            />
                        </Paper>

                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{
                                width: "100%",
                                marginTop: "20px",
                            }}
                        >
                            Đăng tải
                        </Button>
                    </Grid>
                </Grid>
            </Stack>
            {/* Backdrop */}
            <Backdrop
                sx={{
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={loading}
                onClick={() => setLoading(false)}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            {/* Snackbar */}
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

export default BlogCreate;
