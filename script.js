// GANTI DENGAN URL SCRIPT ANDA YANG DIDAPAT DARI LANGKAH DEPLOYMENT
const scriptURL = 'https://script.google.com/macros/s/AKfycbzkt4qHKljuuG6WwS4mCN69NfNietdheRyarnUGKLObfQMHCEfH2tvLLwHhWQOk2-vchA/exec'; 

const form = document.getElementById('alumniForm');
const submitButton = form.querySelector('.submit-btn');

form.addEventListener('submit', e => {
    e.preventDefault(); // Mencegah form reload halaman

    // Ubah teks tombol untuk memberi tahu user bahwa proses sedang berjalan
    submitButton.disabled = true;
    submitButton.textContent = 'Mengirim...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
        .then(response => {
            console.log('Success!', response);
            alert('Registrasi berhasil! Data Anda telah tersimpan.');
            form.reset(); // Mengosongkan form
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim';
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert('Terjadi kesalahan. Silakan coba lagi.');
            submitButton.disabled = false;
            submitButton.textContent = 'Kirim';
        });
});