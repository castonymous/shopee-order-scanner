// Selectors provided by you
const SEL_USERNAME = '.UcYjICexD_';
const SEL_STATUS   = '.WTLtNaavkx';
const SEL_TANGGAL  = '.BwOxlj0Ouf';
const SEL_ORDERID  = '.RdfdqXn1AI';

function cleanUsername(username) { return (username || '').replace(/\./g, ''); }
function lastOrderId5(orderId) { return (orderId || '').trim().slice(-5); }
function copyText(text) { navigator.clipboard.writeText(text || ''); }

function getStatusClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'dikemas': return 'shp-status-pack';
    case 'selesai': return 'shp-status-done';
    case 'dibatalkan': return 'shp-status-cancel';
    case 'dikirim': return 'shp-status-ship';
    case 'belum di bayar':
    case 'belum dibayar': return 'shp-status-unpaid';
    default: return 'shp-status-default';
  }
}

// Try to find a reasonable container for fields based on orderId element
function findContainerFromOrderId(orderEl) {
  let el = orderEl;
  for (let i=0; el && i<8; i++, el = el.parentElement) {
    const hasTanggal = el.querySelector(SEL_TANGGAL);
    const hasStatus  = el.querySelector(SEL_STATUS);
    if (hasTanggal || hasStatus) return el;
  }
  return orderEl.parentElement || orderEl;
}
function qText(el, sel) { const n = el ? el.querySelector(sel) : null; return (n ? n.textContent : '').trim(); }

function scanOrders() {
  // username often appears once in header/panel; try global first
  const globalUser = cleanUsername((document.querySelector(SEL_USERNAME)?.textContent || '').trim());
  const orderEls = Array.from(document.querySelectorAll(SEL_ORDERID));
  const raw = [];
  for (const idEl of orderEls) {
    const container = findContainerFromOrderId(idEl);
    const orderId = (idEl.textContent || '').trim();
    raw.push({
      username: globalUser || cleanUsername(qText(container, SEL_USERNAME)),
      status: qText(container, SEL_STATUS),
      tanggal: qText(container, SEL_TANGGAL),
      orderId
    });
  }
  // dedupe by orderId
  const map = new Map();
  for (const o of raw) {
    if (!o.orderId) continue;
    if (!map.has(o.orderId)) map.set(o.orderId, o);
    else {
      const t = map.get(o.orderId);
      t.username = t.username || o.username;
      t.status   = t.status   || o.status;
      t.tanggal  = t.tanggal  || o.tanggal;
      map.set(o.orderId, t);
    }
  }
  return Array.from(map.values());
}

function renderOrders(orders) {
  let root = document.getElementById('shopee-order-scanner');
  if (!root) { root = document.createElement('div'); root.id = 'shopee-order-scanner'; document.body.appendChild(root); }
  root.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'shp-header';
  header.innerHTML = `
    <div class="shp-title-wrap">
      <div class="shp-title">Shopee Orders</div>
      <div class="shp-username">${orders[0]?.username || ''}</div>
    </div>
    <div>
      <button class="shp-toggle" title="Collapse">▲</button>
      <button class="shp-toggle" title="Debug" id="shp-debug">?</button>
    </div>`;
  root.appendChild(header);

  const body = document.createElement('div'); body.className = 'shp-body'; root.appendChild(body);
  header.querySelector('.shp-toggle').addEventListener('click', () => {
    const collapsed = root.classList.toggle('shp-collapsed');
    header.querySelector('.shp-toggle').textContent = collapsed ? '▼' : '▲';
  });
  header.querySelector('#shp-debug').addEventListener('click', () => {
    console.table(orders);
  });

  for (const o of orders) {
    const username = o.username || '';
    const last5 = lastOrderId5(o.orderId);
    const btn1 = `${username} ${last5}`;
    const btn2 = `${username} ${last5}\n\n${o.tanggal}\n${o.orderId}\n${username}`;
    const btn3 = `${o.status}\n${o.tanggal}\n${o.orderId}\n${username}`;
    const btn4 = username; // Shopee: pakai username saja untuk tombol 4

    const box = document.createElement('div');
    box.className = 'shp-order-box';
    box.innerHTML = `
      <div class="shp-status-bar ${getStatusClass(o.status)}">${o.status || 'STATUS'}</div>
      <div class="shp-info">
        <div class="shp-row"><span class="shp-k">Tanggal</span><span class="shp-v">${o.tanggal || '-'}</span></div>
        <div class="shp-row"><span class="shp-k">Order ID</span><span class="shp-v">${o.orderId || '-'}</span></div>
        <div class="shp-row"><span class="shp-k">Username</span><span class="shp-v">${username || '-'}</span></div>
      </div>
      <div class="shp-buttons">
        <button class="shp-btn" data-copy="${btn1}">1</button>
        <button class="shp-btn" data-copy="${btn2}">2</button>
        <button class="shp-btn" data-copy="${btn3}">3</button>
        <button class="shp-btn" data-copy="${btn4}">4</button>
      </div>`;
    body.appendChild(box);

    box.querySelectorAll('.shp-btn').forEach(b => {
      b.addEventListener('click', () => {
        copyText(b.getAttribute('data-copy'));
        const old = b.textContent; b.textContent = '✔'; setTimeout(()=> b.textContent = old, 700);
      });
    });
  }
}

let last = '';
function tick() {
  const data = scanOrders();
  const key = JSON.stringify(data);
  if (key !== last) { last = key; renderOrders(data); }
}
window.addEventListener('load', () => { tick(); setInterval(tick, 2000); });