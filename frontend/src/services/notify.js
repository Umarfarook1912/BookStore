import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
});

export default {
    toastSuccess: (msg) => Toast.fire({ icon: 'success', title: msg }),
    toastError: (msg) => Toast.fire({ icon: 'error', title: msg }),
    alert: (title, text) => Swal.fire(title, text),
    confirm: async (title = 'Are you sure?', text = '') => {
        const res = await Swal.fire({
            title,
            text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });
        return res.isConfirmed;
    },
    custom: (opts) => Swal.fire(opts),
};
