import Swal from 'sweetalert2';

// Cấu hình Toast mặc định
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
});

const alertService = {
    // Hiện thông báo thành công dạng Toast
    success: (title) => {
        Toast.fire({
            icon: 'success',
            title: title || 'Thao tác thành công!'
        });
    },

    // Hiện thông báo lỗi dạng Toast
    error: (title) => {
        Toast.fire({
            icon: 'error',
            title: title || 'Có lỗi xảy ra!'
        });
    },

    // Hiện Modal cảnh báo chung
    warn: (title, text) => {
        return Swal.fire({
            icon: 'warning',
            title: title,
            text: text,
            confirmButtonColor: '#3b82f6'
        });
    },

    // Hộp thoại xác nhận thao tác (Xóa, Lưu...)
    confirm: async (title, text, confirmButtonText = 'Đồng ý', cancelButtonText = 'Hủy') => {
        const result = await Swal.fire({
            title: title || 'Bạn có chắc chắn?',
            text: text || "Thao tác này không thể hoàn tác!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#10b981', // Màu xanh cho Đồng ý
            cancelButtonColor: '#ef4444', // Màu đỏ cho Hủy
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            reverseButtons: true, // Đảo ngược nút để Hủy bên trái, Đồng ý bên phải (thân thiện hơn trên Win/Mac)
            customClass: {
                popup: 'admin-swal-popup' // Để có thể override css nếu cần
            }
        });
        return result.isConfirmed;
    }
};

export default alertService;
