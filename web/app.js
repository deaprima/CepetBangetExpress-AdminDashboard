// NOTIFICATIONS HANDLING
function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    let errorElement = inputElement.nextElementSibling;

    if (!errorElement || !errorElement.classList.contains("error-message")) {
        errorElement = document.createElement("small");
        errorElement.classList.add("error-message", "text-danger");
        inputElement.parentNode.appendChild(errorElement);
    }

    errorElement.textContent = message;
}

function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((error) => error.remove());
}

async function showSuccessMessage(title, message) {
    await Swal.fire({
        title: title,
        text: message,
        icon: 'success',
        confirmButtonColor: '#003366', 
        confirmButtonText: 'OK'
    });
}

async function showErrorMessage(title, message) {
    await Swal.fire({
        title: title,
        text: message,
        icon: 'error',
        confirmButtonColor: '#003366', 
        confirmButtonText: 'OK'
    });
}

async function showDeleteConfirmation() {
    const result = await Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Data yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#003366', 
        cancelButtonColor: '#FD7702', 
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal'
    });
    return result.isConfirmed;
}



// MAIN FUNCTIONS
async function isDuplicate(field, value) {
    const data = await eel.read_data()();
    return data.some((item) => item[field] === value);
}

async function readData() {
    const data = await eel.read_data()();
    const tbody = document.getElementById("dataTable");

    tbody.innerHTML = "";

    data.forEach((item) => {
        const row = `
            <tr>
                <td>${item.id_admin}</td>
                <td>${item.nama_lengkap}</td>
                <td>${item.username_admin}</td>
                <td>${item.jabatan_admin}</td>
                <td>${item.no_telepon_admin}</td>
                <td>${item.email_admin}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editData('${item.id_admin}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteData('${item.id_admin}')">Hapus</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function createData() {
    const namaLengkap = document.getElementById("nama_admin").value.trim();
    const username = document.getElementById("username_admin").value.trim();
    const password = document.getElementById("password_admin").value.trim();
    const jabatan = document.getElementById("jabatan_admin").value.trim();
    const no_telepon = document.getElementById("no_telepon_admin").value.trim();
    const email = document.getElementById("email_admin").value.trim();

    let valid = true;

    if (namaLengkap === "") {
        showError("nama_admin", "Nama lengkap wajib diisi!");
        valid = false;
    }

    if (username === "") {
        showError("username_admin", "Username wajib diisi!");
        valid = false;
    } else if (await isDuplicate("username_admin", username)) {
        showError("username_admin", "Username sudah terdaftar!");
        valid = false;
    }

    if (password === "") {
        showError("password_admin", "Password wajib diisi!");
        valid = false;
    }

    if (jabatan === "") {
        showError("jabatan_admin", "Jabatan wajib diisi!");
        valid = false;
    }

    if (no_telepon === "") {
        showError("no_telepon_admin", "No telepon wajib diisi!");
        valid = false;
    } else if (!/^\d+$/.test(no_telepon)) {
        showError("no_telepon_admin", "No telepon harus berupa angka!");
        valid = false;
    } else if (await isDuplicate("no_telepon_admin", no_telepon)) {
        showError("no_telepon_admin", "No telepon sudah terdaftar!");
        valid = false;
    }

    if (email === "") {
        showError("email_admin", "Email wajib diisi!");
        valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        showError("email_admin", "Format email tidak valid!");
        valid = false;
    } else if (await isDuplicate("email_admin", email)) {
        showError("email_admin", "Email sudah terdaftar!");
        valid = false;
    }

    if (!valid) return; 
    
    await eel.create_data(namaLengkap, username, password, jabatan, no_telepon, email)();
    await showSuccessMessage('Berhasil!', 'Data admin berhasil ditambahkan');
    document.getElementById("crudForm").reset();
    clearErrors();
    readData();
}

async function editData(id_admin) {
    const data = await eel.read_data()(); 
    const adminData = data.find(item => item.id_admin === id_admin);

    console.log(adminData); 

    document.getElementById("edit_id_admin").value = adminData.id_admin;
    document.getElementById("edit_nama_admin").value = adminData.nama_lengkap;
    document.getElementById("edit_username_admin").value = adminData.username_admin;
    document.getElementById("edit_password_admin").value = adminData.password_admin;
    document.getElementById("edit_jabatan_admin").value = adminData.jabatan_admin;
    document.getElementById("edit_no_telepon_admin").value = adminData.no_telepon_admin;
    document.getElementById("edit_email_admin").value = adminData.email_admin;

    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
}

async function updateData() {
    const id_admin = document.getElementById("edit_id_admin").value;
    const namaLengkap = document.getElementById("edit_nama_admin").value.trim();
    const username = document.getElementById("edit_username_admin").value.trim();
    const password = document.getElementById("edit_password_admin").value.trim();
    const jabatan = document.getElementById("edit_jabatan_admin").value.trim();
    const no_telepon = document.getElementById("edit_no_telepon_admin").value.trim();
    const email = document.getElementById("edit_email_admin").value.trim();

    let valid = true;

    if (namaLengkap === "") {
        await showErrorMessage('Error!', 'Nama lengkap wajib diisi!');
        valid = false;
        return;
    }

    if (username === "") {
        await showErrorMessage('Error!', 'Username wajib diisi!');
        valid = false;
        return;
    }

    if (password === "") {
        await showErrorMessage('Error!', 'Password wajib diisi!');
        valid = false;
        return;
    }

    if (jabatan === "") {
        await showErrorMessage('Error!', 'Jabatan wajib diisi!');
        valid = false;
        return;
    }

    if (no_telepon === "") {
        await showErrorMessage('Error!', 'No telepon wajib diisi!');
        valid = false;
        return;
    } else if (!/^\d+$/.test(no_telepon)) {
        await showErrorMessage('Error!', 'No telepon harus berupa angka!');
        valid = false;
        return;
    }

    if (email === "") {
        await showErrorMessage('Error!', 'Email wajib diisi!');
        valid = false;
        return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        await showErrorMessage('Error!', 'Format email tidak valid!');
        valid = false;
        return;
    }

    if (!valid) return;

    const result = await eel.update_data(id_admin, namaLengkap, username, password, jabatan, no_telepon, email)();
    
    if (result.startsWith('Error:')) {
        await showErrorMessage('Gagal!', result.substring(7));
        return;
    }
    
    await showSuccessMessage('Berhasil!', 'Data berhasil diperbarui');
    clearErrors();
    readData();

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
    editModal.hide();
}

async function deleteData(id_admin) {
    const confirmed = await showDeleteConfirmation();
    if (confirmed) {
        await eel.delete_data(id_admin)();
        await showSuccessMessage('Berhasil!', 'Data admin berhasil dihapus');
        readData();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    readData();
});