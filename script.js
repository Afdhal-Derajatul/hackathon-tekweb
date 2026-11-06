/* ========================================================
   WashFlow - JavaScript Dasar & DOM Manipulation (Modul 6)
   ======================================================== */


// Alur Tahapan Status Cucian
const alurStatus = ['Antrean', 'Dicuci', 'Disetrika', 'Siap Diambil', 'Selesai'];

// 2. Baca / Tulis Data di LocalStorage (Modul 6 Halaman 55)
function getOrders() {
  const data = localStorage.getItem('washflow_orders');
  return data ? JSON.parse(data) : defaultOrders;
}

function saveOrders(orders) {
  localStorage.setItem('washflow_orders', JSON.stringify(orders));
}

// 3. Format Rupiah (Modul 6: Operator & Fungsi)
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}

// 4. Warna Badge Status
function getWarnaStatus(status) {
  switch (status) {
    case 'Antrean': return 'bg-amber-100 text-amber-800';
    case 'Dicuci': return 'bg-blue-100 text-blue-800';
    case 'Disetrika': return 'bg-purple-100 text-purple-800';
    case 'Siap Diambil': return 'bg-emerald-100 text-emerald-800';
    default: return 'bg-slate-100 text-slate-700';
  }
}

// 5. Render Daftar Cucian ke HTML (Modul 6: Manipulasi DOM)
function renderOrders() {
  const orders = getOrders();
  const container = document.getElementById('container-daftar-cucian');
  const countBadge = document.getElementById('total-cucian-count');
  
  countBadge.textContent = orders.length;
  container.innerHTML = '';

  if (orders.length === 0) {
    container.innerHTML = '<p class="text-center text-slate-400 py-6 text-xs">Belum ada data cucian.</p>';
    return;
  }

  orders.forEach((order, index) => {
    const card = document.createElement('div');
    card.className = 'p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3';
    
    card.innerHTML = `
      <div>
        <div class="flex items-center space-x-2">
          <span class="font-mono font-bold text-blue-600 text-sm">${order.resi}</span>
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full ${getWarnaStatus(order.status)}">
            ${order.status}
          </span>
        </div>
        <h3 class="font-bold text-slate-800 mt-1">${order.nama} <span class="text-xs text-slate-400 font-normal">(${order.hp})</span></h3>
        <p class="text-xs text-slate-500">${order.layanan} • ${order.berat} ${order.unit}</p>
        <p class="text-xs font-extrabold text-blue-700 mt-0.5">${formatRupiah(order.total)}</p>
      </div>
      <div class="flex items-center space-x-2 self-end sm:self-auto">
        <button onclick="bukaModalStruk('${order.resi}')" class="px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-semibold text-slate-600 flex items-center space-x-1">
          <i class="fa-solid fa-print"></i>
          <span>Struk</span>
        </button>
        <button onclick="kirimPesanWA('${order.resi}')" class="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold flex items-center space-x-1">
          <i class="fa-brands fa-whatsapp"></i>
          <span>WA</span>
        </button>
        ${order.status !== 'Selesai' ? `
          <button onclick="naikkanStatusOrder(${index})" class="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1">
            <span>Lanjut</span>
            <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        ` : ''}
      </div>
    `;

    container.appendChild(card);
  });
}

// 6. Event Naikkan Status Cucian
window.naikkanStatusOrder = function(index) {
  const orders = getOrders();
  const currentStatus = orders[index].status;
  const currentIndex = alurStatus.indexOf(currentStatus);
  
  if (currentIndex < alurStatus.length - 1) {
    orders[index].status = alurStatus[currentIndex + 1];
    saveOrders(orders);
    renderOrders();
  }
};

// 7. Kalkulasi Live Total Biaya (Modul 6: Operator Matematika)
function hitungTotal() {
  const selectLayanan = document.getElementById('select-layanan');
  const hargaPerUnit = parseFloat(selectLayanan.value);
  const berat = parseFloat(document.getElementById('input-berat').value) || 0;
  
  const total = hargaPerUnit * berat;
  document.getElementById('display-total').textContent = formatRupiah(total);
}

// 8. Event Listener Form Tambah Pesanan (Modul 6: Event Handling)
document.getElementById('form-order').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const nama = document.getElementById('input-nama').value.trim();
  const hp = document.getElementById('input-hp').value.trim();
  const selectLayanan = document.getElementById('select-layanan');
  const layananNama = selectLayanan.options[selectLayanan.selectedIndex].getAttribute('data-nama');
  const unit = selectLayanan.options[selectLayanan.selectedIndex].getAttribute('data-unit');
  const hargaPerUnit = parseFloat(selectLayanan.value);
  const berat = parseFloat(document.getElementById('input-berat').value);
  
  if (!nama || !hp || berat <= 0) {
    alert('Harap isi semua data dengan benar!');
    return;
  }

  const orders = getOrders();
  const resiBaru = 'WF-' + (100 + orders.length + 1);

  const pesananBaru = {
    resi: resiBaru,
    nama: nama,
    hp: hp,
    layanan: layananNama,
    berat: berat,
    unit: unit,
    total: hargaPerUnit * berat,
    status: 'Antrean'
  };

  orders.unshift(pesananBaru);
  saveOrders(orders);
  renderOrders();

  // Reset form input
  document.getElementById('input-nama').value = '';
  document.getElementById('input-hp').value = '';
  document.getElementById('input-berat').value = '1';
  hitungTotal();

  alert('Pesanan ' + resiBaru + ' berhasil disimpan permanen!');
});

// Listener saat dropdown layanan / berat diubah
document.getElementById('select-layanan').addEventListener('change', function() {
  const unit = this.options[this.selectedIndex].getAttribute('data-unit');
  document.getElementById('label-berat').textContent = `Berat / Jumlah (${unit})`;
  hitungTotal();
});
document.getElementById('input-berat').addEventListener('input', hitungTotal);

// 9. Lacak Resi Pelanggan (Modul 6: DOM Manipulation)
document.getElementById('btn-cari-resi').addEventListener('click', function() {
  const input = document.getElementById('input-resi-lacak').value.trim().toUpperCase();
  const hasilBox = document.getElementById('hasil-pencarian');
  const pesanKosong = document.getElementById('pesan-tidak-ditemukan');
  
  if (!input) return;

  const orders = getOrders();
  const order = orders.find(o => o.resi.toUpperCase() === input);

  if (order) {
    hasilBox.innerHTML = `
      <div class="flex justify-between items-center mb-3">
        <span class="font-mono font-extrabold text-blue-600 text-base">${order.resi}</span>
        <span class="text-xs font-bold px-3 py-1 rounded-full ${getWarnaStatus(order.status)}">
          ${order.status}
        </span>
      </div>
      <div class="bg-slate-50 p-3.5 rounded-xl text-xs space-y-1.5 text-slate-600">
        <div class="flex justify-between">
          <span class="text-slate-400">Nama Pelanggan:</span>
          <span class="font-bold text-slate-800">${order.nama}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Layanan:</span>
          <span>${order.layanan}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-slate-400">Berat/Qty:</span>
          <span>${order.berat} ${order.unit}</span>
        </div>
        <div class="flex justify-between border-t border-slate-200 pt-1 font-bold">
          <span class="text-slate-700">Total Biaya:</span>
          <span class="text-blue-700">${formatRupiah(order.total)}</span>
        </div>
      </div>
    `;
    hasilBox.classList.remove('hidden');
    pesanKosong.classList.add('hidden');
  } else {
    hasilBox.classList.add('hidden');
    pesanKosong.classList.remove('hidden');
  }
});

// 10. Navigasi Tab (Kasir vs Lacak)
document.getElementById('btn-tab-kasir').addEventListener('click', function() {
  document.getElementById('view-kasir').classList.remove('hidden');
  document.getElementById('view-lacak').classList.add('hidden');
  this.className = 'px-3.5 py-1.5 rounded-lg font-bold bg-white text-blue-600 shadow-sm transition-all';
  document.getElementById('btn-tab-lacak').className = 'px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all';
});

document.getElementById('btn-tab-lacak').addEventListener('click', function() {
  document.getElementById('view-kasir').classList.add('hidden');
  document.getElementById('view-lacak').classList.remove('hidden');
  this.className = 'px-3.5 py-1.5 rounded-lg font-bold bg-white text-blue-600 shadow-sm transition-all';
  document.getElementById('btn-tab-kasir').className = 'px-3.5 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 transition-all';
});

// 11. Modal Struk
window.bukaModalStruk = function(resi) {
  const orders = getOrders();
  const order = orders.find(o => o.resi === resi);
  if (!order) return;

  document.getElementById('struk-resi').textContent = order.resi;
  document.getElementById('struk-nama').textContent = order.nama;
  document.getElementById('struk-layanan').textContent = order.layanan;
  document.getElementById('struk-berat').textContent = `${order.berat} ${order.unit}`;
  document.getElementById('struk-total').textContent = formatRupiah(order.total);
  document.getElementById('struk-grand-total').textContent = formatRupiah(order.total);

  document.getElementById('modal-struk').classList.remove('hidden');
};

document.getElementById('btn-tutup-struk').addEventListener('click', function() {
  document.getElementById('modal-struk').classList.add('hidden');
});

document.getElementById('btn-print-struk').addEventListener('click', function() {
  window.print();
});

// 12. Kirim WhatsApp Otomatis
window.kirimPesanWA = function(resi) {
  const orders = getOrders();
  const order = orders.find(o => o.resi === resi);
  if (!order) return;

  let hp = order.hp.replace(/[^0-9]/g, '');
  if (hp.startsWith('0')) hp = '62' + hp.substring(1);
  const pesan = `Halo Kak ${order.nama}, status cucian Anda di WashFlow resi *${order.resi}* saat ini: *${order.status}*. Total: ${formatRupiah(order.total)}`;
  window.open(`https://wa.me/${hp}?text=${encodeURIComponent(pesan)}`, '_blank');
};

// 13. Reset Data Demo
document.getElementById('btn-reset-data').addEventListener('click', function() {
  if (confirm('Reset ulang data pesanan ke default demo?')) {
    localStorage.removeItem('washflow_orders');
    renderOrders();
  }
});

// Inisialisasi saat halaman pertama kali dimuat
renderOrders();
hitungTotal();