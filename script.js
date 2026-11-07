// 1. Variabel Tetap (Tarif per Kg)
const TARIF_PER_KG = 8000;

// 2. Ambil elemen HTML yang dibutuhkan (Modul 6 Hal 58: getElementById)
const formLaundry = document.getElementById('form-laundry');
const inputNama = document.getElementById('input-nama');
const inputBerat = document.getElementById('input-berat');
const textTotal = document.getElementById('text-total');
const tabelCucian = document.getElementById('tabel-cucian');

// 3. Muat Data dari LocalStorage saat pertama buka (Modul 6 Hal 55)
let daftarLaundry = JSON.parse(localStorage.getItem('data_laundry')) || [
  { nama: 'Dinda', berat: 3, total: 24000, status: 'Sedang Dicuci' }
];

// 4. Fungsi Hitung Total Harga Otomatis (Modul 6 Hal 51: Operator & Fungsi)
function hitungTotal() {
  const berat = parseFloat(inputBerat.value) || 0;
  const total = berat * TARIF_PER_KG;
  textTotal.textContent = 'Rp ' + total.toLocaleString('id-ID');
}
inputBerat.addEventListener('input', hitungTotal);

// 5. Fungsi Menyimpan Data ke LocalStorage (Modul 6 Hal 55)
function simpanKeLocalStorage() {
  localStorage.setItem('data_laundry', JSON.stringify(daftarLaundry));
}

// 6. Fungsi Menampilkan Data ke Tabel HTML (Modul 6 Hal 62: Manipulasi DOM)
function renderTabel() {
  tabelCucian.innerHTML = ''; // Kosongkan tabel dulu

  daftarLaundry.forEach(function(item, index) {
    const baris = document.createElement('tr');
    baris.innerHTML = `
      <td class="p-2 border font-semibold">${item.nama}</td>
      <td class="p-2 border">${item.berat} Kg</td>
      <td class="p-2 border font-bold text-blue-600">Rp ${item.total.toLocaleString('id-ID')}</td>
      <td class="p-2 border">
        <span class="px-2 py-1 rounded text-xs font-bold ${item.status === 'Selesai' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
          ${item.status}
        </span>
      </td>
      <td class="p-2 border text-center space-x-1">
        <button onclick="ubahStatus(${index})" class="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
          ${item.status === 'Sedang Dicuci' ? 'Selesai' : 'Cuci Lagi'}
        </button>
        <button onclick="hapusPesanan(${index})" class="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
          Hapus
        </button>
      </td>
    `;
    tabelCucian.appendChild(baris);
  });
}

// 7. Event saat tombol "+ Tambah Cucian" di-submit (Modul 6 Hal 53)
formLaundry.addEventListener('submit', function(e) {
  e.preventDefault(); // Mencegah reload halaman

  const pesananBaru = {
    nama: inputNama.value,
    berat: parseFloat(inputBerat.value),
    total: parseFloat(inputBerat.value) * TARIF_PER_KG,
    status: 'Sedang Dicuci'
  };

  daftarLaundry.push(pesananBaru); // Masukkan ke daftar
  simpanKeLocalStorage();          // Simpan ke memori browser
  renderTabel();                   // Perbarui tampilan tabel

  // Reset form
  inputNama.value = '';
  inputBerat.value = 1;
  hitungTotal();
});

// 8. Fungsi Mengubah Status Pesanan
function ubahStatus(index) {
  if (daftarLaundry[index].status === 'Sedang Dicuci') {
    daftarLaundry[index].status = 'Selesai';
  } else {
    daftarLaundry[index].status = 'Sedang Dicuci';
  }
  simpanKeLocalStorage();
  renderTabel();
}

// 9. Fungsi Menghapus Pesanan
function hapusPesanan(index) {
  if (confirm('Yakin ingin menghapus data ini?')) {
    daftarLaundry.splice(index, 1); // Hapus 1 data dari array
    simpanKeLocalStorage();
    renderTabel();
  }
}

// Jalankan fungsi awal saat web dibuka
renderTabel();