// component
import Iconify from "../../components/Iconify";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: "Trang chủ",
        path: "/dashboard/app",
        icon: getIcon("eva:pie-chart-2-fill"),
    },
    {
        title: "E-commerce",
        path: "/dashboard/e-commerce",
        icon: getIcon("iconoir:cart-alt"),
    },
    {
        title: "Hóa đơn",
        path: "/dashboard/invoice/list",
        icon: getIcon("fa-solid:file-invoice"),
    },
    {
        title: "Danh mục",
        path: "/dashboard/categories",
        icon: getIcon("ic:outline-list"),
    },
    {
        title: "Sản phẩm",
        path: "/dashboard/products",
        icon: getIcon("eva:shopping-bag-fill"),
        // icon: getIcon("eva:file-text-fill"),
        children: [
            // {
            //     title: "EcommerceShop",
            //     path: "products/ecommerceShop",
            //     icon: getIcon("eva:shopping-bag-fill"),
            // },
            {
                title: "Danh sách",
                path: "products/list",
                icon: getIcon("eva:shopping-bag-fill"),
            },
            {
                title: "Tạo mới",
                path: "products/create",
                icon: getIcon("eva:shopping-bag-fill"),
            },
            {
                title: "Chỉnh sửa",
                path: "products/:slug/edit",
                icon: getIcon("eva:shopping-bag-fill"),
            },
            // {
            //     title: "Đặt hàng",
            //     path: "products/order",
            //     icon: getIcon("eva:shopping-bag-fill"),
            // },
            {
                title: "Thùng rác",
                path: "products/trash",
                icon: getIcon("eva:shopping-bag-fill"),
            },
        ],
    },
    {
        title: "Bài viết",
        path: "/dashboard/blog",
        icon: getIcon("ion:newspaper-outline"),
        children: [
            {
                title: "Danh sách",
                path: "/dashboard/blog/list",
                icon: getIcon("eva:file-text-fill"),
            },
            {
                title: "Tạo mới",
                path: "/dashboard/blog/create",
                icon: getIcon("eva:file-text-fill"),
            },
        ],
    },
    // {
    //     title: "Tài khoản",
    //     path: "/dashboard/user",
    //     icon: getIcon("eva:people-fill"),
    //     children: [
    //         {
    //             title: "Danh sách",
    //             path: "/dashboard/user",
    //         },
    //         {
    //             title: "Tạo mới",
    //             path: "/dashboard/user",
    //         },
    //         {
    //             title: "Cập nhật",
    //             path: "/dashboard/user",
    //         },
    //     ],
    // },
    // {
    //     title: "Hóa đơn",
    //     path: "/dashboard/invoice",
    //     icon: getIcon("fa-solid:file-invoice"),
    //     children: [
    //         {
    //             title: "Danh sách",
    //             path: "/dashboard/invoice/list",
    //             icon: getIcon("eva:file-text-fill"),
    //         },
    //         {
    //             title: "Chi tiết",
    //             path: "/dashboard/invoice/details",
    //             icon: getIcon("eva:file-text-fill"),
    //         },
    //         {
    //             title: "Tạo mới",
    //             path: "/dashboard/invoice/create",
    //             icon: getIcon("eva:file-text-fill"),
    //         },
    //         {
    //             title: "Cập nhật",
    //             path: "/dashboard/me/order",
    //             icon: getIcon("eva:file-text-fill"),
    //         },
    //     ],
    // },
    {
        title: "Đặt hàng",
        icon: getIcon("icon-park-outline:transaction-order"),
        children: [
            {
                title: "Tạo đơn",
                path: "/dashboard/me/saleOrder",
                icon: getIcon("eva:file-text-fill"),
            },
            {
                title: "Danh sách",
                path: "/dashboard/me/list",
                icon: getIcon("eva:file-text-fill"),
            },
        ],
    },
    {
        title: "Khuyến mãi",
        icon: getIcon("mdi:voucher-outline"),
        children: [
            {
                title: "Tạo mới",
                path: "/dashboard/discount/create",
                icon: getIcon("eva:file-text-fill"),
            },
            {
                title: "Danh sách",
                path: "/dashboard/discount/list",
                icon: getIcon("eva:file-text-fill"),
            },
        ],
    },
    {
        title: "Cài đặt",
        path: "/dashboard/setting",
        icon: getIcon("ant-design:setting-outlined"),
    },
    {
        title: "Cài đặt ngôn ngữ",
        path: "/dashboard/language",
        icon: getIcon("material-symbols:language")
    }
    // {
    //     title: "login",
    //     path: "/login",
    //     icon: getIcon("eva:lock-fill"),
    // },
    // {
    //     title: "register",
    //     path: "/register",
    //     icon: getIcon("eva:person-add-fill"),
    // },
    // {
    //     title: "Not found",
    //     path: "/404",
    //     icon: getIcon("eva:alert-triangle-fill"),
    // },
];

export default navConfig;
