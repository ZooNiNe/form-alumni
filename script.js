// GANTI DENGAN URL SCRIPT ANDA YANG SUDAH DI-DEPLOY
const scriptURL = 'https://script.google.com/macros/s/AKfycbwnktqvgVXQblBqYL39CJ3piaNopBo0-BMNq5hXXpelwV0ZjphIMe8vkpiQKw37t1_2fg/exec';

// --- Ambil semua elemen yang kita butuhkan ---
const form = document.getElementById('alumniForm');
const submitButton = form.querySelector('.submit-btn');
const previewModal = document.getElementById('previewModal');
const confirmBtn = document.getElementById('confirm-btn');
const cancelBtn = document.getElementById('cancel-btn');

// --- Fungsi untuk menampilkan preview ---
function showPreview(e) {
    e.preventDefault();

    const nama = form.nama.value;
    const angkatan = form.angkatan.value;
    const whatsapp = form.whatsapp.value;
    const alamat = form.alamat.value;
    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    document.getElementById('preview-nama').textContent = nama;
    document.getElementById('preview-angkatan').textContent = angkatan;
    document.getElementById('preview-whatsapp').textContent = whatsapp;
    document.getElementById('preview-alamat').textContent = alamat;

    const imgPreview = document.getElementById('preview-foto');
    const noFotoText = document.getElementById('preview-foto-kosong');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imgPreview.src = e.target.result;
            imgPreview.style.display = 'block';
            noFotoText.style.display = 'none';
        }
        reader.readAsDataURL(file);
    } else {
        imgPreview.style.display = 'none';
        noFotoText.style.display = 'block';
    }

    previewModal.classList.add('active');
}

// --- Tambahkan event listener ke tombol utama ---
form.addEventListener('submit', showPreview);

// --- Event listener untuk tombol di dalam pop-up ---
cancelBtn.addEventListener('click', () => {
    previewModal.classList.remove('active');
});

confirmBtn.addEventListener('click', () => {
    submitButton.disabled = true;
    submitButton.textContent = 'Mengirim...';
    previewModal.classList.remove('active');
    sendData();
});

// --- Fungsi untuk mengirim data (sendData) ---
function sendData() {
    const fileInput = document.getElementById('foto');
    const file = fileInput.files[0];

    let payload = {
        nama: form.nama.value,
        angkatan: form.angkatan.value,
        whatsapp: form.whatsapp.value,
        alamat: form.alamat.value,
        foto: null,
        tipeFile: null
    };

    const processAndFetch = () => {
        fetch(scriptURL, {
            method: 'POST',
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.result === "success") {
                alert('Registrasi berhasil! Data Anda telah tersimpan.');
                form.reset();
            } else if (data.result === "exists") {
                alert('Pendaftaran Gagal! Nomor WhatsApp ini sudah terdaftar sebelumnya.');
            } else {
                throw new Error(data.error || 'Terjadi kesalahan pada server.');
            }
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim';
        });
    };
    
    if (file) {
        const reader = new FileReader();
        reader.onloadend = function() {
            const base64Data = reader.result.split(',')[1];
            payload.foto = base64Data;
            payload.tipeFile = file.type;
            processAndFetch();
        }
        reader.readAsDataURL(file);
    } else {
        processAndFetch();
    }
}