/**
 * OMNI ATELIER — CART DRAWER & ACID CHECKOUT MODAL
 * Slide-out luxury shopping bag with real-time price updates and explicit ACID transaction execution on CockroachDB.
 */

export function createCartDrawer(initialCart, onUpdateQty, onRemoveItem, onCheckout) {
  const container = document.createElement('div');

  container.innerHTML = `
    <!-- Backdrop Overlay -->
    <div id="cart-drawer-overlay" class="cart-drawer-overlay"></div>

    <!-- Right Slide-Out Drawer Panel -->
    <aside id="cart-drawer" class="cart-drawer" aria-label="Shopping Bag">
      <div class="drawer-header">
        <div>
          <h3 style="font-family: var(--font-serif); font-size: 1.625rem; color: var(--color-midnight); line-height: 1.2;">
            Shopping Bag
          </h3>
          <p style="font-size: 0.75rem; color: var(--color-text-secondary); margin-top: 2px;" id="drawer-item-count">
            0 curations selected
          </p>
        </div>
        <button id="close-drawer-btn" class="btn btn-outline btn-sm" aria-label="Close Bag" style="font-size: 1.25rem; padding: 4px 10px;">
          &times;
        </button>
      </div>

      <!-- Item List Container -->
      <div class="drawer-body" id="drawer-items-list">
        <!-- Rendered dynamically -->
      </div>

      <!-- Drawer Footer with Subtotal & Actions -->
      <div class="drawer-footer">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.875rem; color:var(--color-text-secondary);">
          <span>Atelier Subtotal</span>
          <span id="drawer-subtotal" style="font-weight:600; color:var(--color-midnight);">&#8377;0.00</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:0.75rem; color:var(--color-emerald);">
          <span>White-Glove Insured Delivery</span>
          <span style="font-weight:700;">COMPLIMENTARY</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:20px; font-size:1.1875rem; font-weight:700; color:var(--color-midnight); border-top:1px solid var(--color-border); padding-top:10px;">
          <span>Estimated Total (INR)</span>
          <span id="drawer-total" style="color:var(--color-emerald); font-variant-numeric:tabular-nums;">&#8377;0.00</span>
        </div>
        <button id="checkout-btn" class="btn btn-primary btn-lg" style="width:100%;">
          Proceed to Order Settlement →
        </button>
        <p style="text-align:center; font-size:0.6875rem; color:var(--color-text-muted); margin-top:10px; font-family:var(--font-mono);">
          Multi-table SERIALIZABLE transaction (BEGIN ... COMMIT)
        </p>
      </div>
    </aside>

    <!-- ACID Checkout Modal -->
    <div id="checkout-modal-overlay" class="modal-overlay">
      <div class="modal-card" style="max-width:560px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
          <div>
            <span style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.1em; color:var(--color-emerald); font-weight:700;">ACID TRANSACTION DEMARCATION</span>
            <h3 style="font-family: var(--font-serif); font-size: 1.875rem; color: var(--color-midnight); margin-top:2px;">
              Confirm Order Commission
            </h3>
          </div>
          <button id="close-checkout-modal" class="btn btn-outline btn-sm">&times;</button>
        </div>

        <div style="background:var(--color-ivory-warm); padding:16px 20px; border-radius:var(--radius-sm); border:1px solid var(--color-border); margin-bottom:20px;">
          <p style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.06em; color:var(--color-text-muted); margin-bottom:8px;">Commission Summary</p>
          <div id="modal-summary-items" style="font-size:0.875rem; margin-bottom:12px; display:flex; flex-direction:column; gap:6px;"></div>
          <div style="display:flex; justify-content:space-between; font-weight:700; font-size:1.125rem; border-top:1px solid var(--color-border); padding-top:10px; color:var(--color-midnight);">
            <span>Settlement Total:</span>
            <span id="modal-grand-total" style="color:var(--color-emerald);">&#8377;0.00</span>
          </div>
        </div>

        <form id="checkout-form">
          <div style="margin-bottom:16px;">
            <label class="form-label">Patron Account (Authenticated Buyer)</label>
            <select id="checkout-user-id" class="form-select">
              <option value="4">Vikram Singh · Bangalore (vikram.singh@yahoo.com)</option>
              <option value="5">Ananya Roy · Mumbai (ananya.roy@outlook.com)</option>
              <option value="6">Rohit Verma · Delhi (rohit.verma@gmail.com)</option>
            </select>
          </div>

          <div style="margin-bottom:20px;">
            <label class="form-label">Payment Settlement Channel</label>
            <select id="checkout-pay-method" class="form-select">
              <option value="UPI">UPI (Instant Real-Time Settlement)</option>
              <option value="Credit Card">Credit Card (Concierge Tokenized)</option>
              <option value="NetBanking">NetBanking (NEFT/RTGS)</option>
            </select>
          </div>

          <div id="checkout-status-msg" style="display:none; padding:14px; border-radius:var(--radius-sm); margin-bottom:18px; font-size:0.875rem;"></div>

          <div style="display:flex; justify-content:flex-end; gap:12px;">
            <button type="button" id="cancel-checkout-btn" class="btn btn-outline">Cancel</button>
            <button type="submit" id="submit-order-btn" class="btn btn-emerald">
              Commit to CockroachDB
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  let cart = initialCart || [];

  const drawer = container.querySelector('#cart-drawer');
  const overlay = container.querySelector('#cart-drawer-overlay');
  const closeBtn = container.querySelector('#close-drawer-btn');
  const checkoutBtn = container.querySelector('#checkout-btn');

  const checkoutModal = container.querySelector('#checkout-modal-overlay');
  const closeCheckoutBtn = container.querySelector('#close-checkout-modal');
  const cancelCheckoutBtn = container.querySelector('#cancel-checkout-btn');
  const checkoutForm = container.querySelector('#checkout-form');
  const statusMsg = container.querySelector('#checkout-status-msg');
  const submitBtn = container.querySelector('#submit-order-btn');

  function openDrawer() {
    drawer.classList.add('open');
    overlay.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
  }

  overlay.addEventListener('click', closeDrawer);
  closeBtn.addEventListener('click', closeDrawer);

  function openCheckoutModal() {
    if (cart.length === 0) {
      alert("Your shopping bag is empty.");
      return;
    }
    closeDrawer();

    const summaryContainer = container.querySelector('#modal-summary-items');
    summaryContainer.innerHTML = '';

    let grandTotal = 0;
    cart.forEach(item => {
      const itemTotal = Number(item.price) * item.qty;
      grandTotal += itemTotal;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; justify-content:space-between;';
      const formattedTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(itemTotal);
      row.innerHTML = `
        <span style="color:var(--color-text-secondary);">${item.qty}x ${item.name} ${item.selectedVariant ? `(${item.selectedVariant})` : ''}</span>
        <span style="font-weight:600; color:var(--color-midnight);">${formattedTotal}</span>
      `;
      summaryContainer.appendChild(row);
    });

    container.querySelector('#modal-grand-total').textContent =
      new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal);

    statusMsg.style.display = 'none';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Commit to CockroachDB';

    checkoutModal.classList.add('open');
  }

  function closeCheckoutModal() {
    checkoutModal.classList.remove('open');
  }

  checkoutBtn.addEventListener('click', openCheckoutModal);
  closeCheckoutBtn.addEventListener('click', closeCheckoutModal);
  cancelCheckoutBtn.addEventListener('click', closeCheckoutModal);

  checkoutModal.addEventListener('click', (e) => {
    if (e.target === checkoutModal) closeCheckoutModal();
  });

  // Handle Checkout Form Submission (multi-table ACID transaction)
  checkoutForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userId = parseInt(container.querySelector('#checkout-user-id').value, 10);
    const payMethod = container.querySelector('#checkout-pay-method').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Executing ACID Transaction...';
    statusMsg.style.display = 'block';
    statusMsg.style.backgroundColor = 'var(--color-ivory)';
    statusMsg.style.color = 'var(--color-midnight)';
    statusMsg.style.border = '1px solid var(--color-border)';
    statusMsg.innerHTML = 'Initiating atomic connection: <code>conn.setAutoCommit(false)</code>...';

    const checkoutData = {
      userId,
      payMethod,
      items: cart.map(it => ({
        productId: it.id,
        qty: it.qty,
        price: it.price
      }))
    };

    try {
      const order = await onCheckout(checkoutData);
      statusMsg.style.backgroundColor = 'var(--color-success-bg)';
      statusMsg.style.color = 'var(--color-success)';
      statusMsg.style.border = '1px solid rgba(30,107,69,0.3)';
      statusMsg.innerHTML = `
        <strong>✅ Transaction Committed Successfully!</strong><br />
        Order Record: <code>orders.id = #${order.id}</code><br />
        Payment Settlement: <code>payments.pay_id = #${order.payment?.payId || 'N/A'}</code> (${order.payment?.payMethod})<br />
        Relational inventory balances updated inside the same CockroachDB transaction.
      `;
      submitBtn.textContent = 'Order Placed ✓';
      setTimeout(() => {
        closeCheckoutModal();
      }, 2600);
    } catch (err) {
      statusMsg.style.backgroundColor = 'var(--color-error-bg)';
      statusMsg.style.color = 'var(--color-error)';
      statusMsg.style.border = '1px solid rgba(181,63,63,0.3)';
      statusMsg.innerHTML = `
        <strong>⚠️ Transaction Rolled Back (Atomicity Preserved):</strong><br />
        ${err.message}
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Retry Transaction';
    }
  });

  function renderCart() {
    const list = container.querySelector('#drawer-items-list');
    const countEl = container.querySelector('#drawer-item-count');
    const subtotalEl = container.querySelector('#drawer-subtotal');
    const totalEl = container.querySelector('#drawer-total');

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    countEl.textContent = `${totalQty} curation${totalQty === 1 ? '' : 's'} in bag`;

    if (cart.length === 0) {
      list.innerHTML = `
        <div style="text-align:center; padding:64px 20px; color:var(--color-text-muted);">
          <div style="font-size:2.5rem; margin-bottom:12px;">🛍</div>
          <p style="font-family:var(--font-serif); font-size:1.375rem; color:var(--color-midnight); margin-bottom:4px;">Your bag is empty.</p>
          <p style="font-size:0.8125rem;">Discover our 36 bespoke curations in the storefront.</p>
        </div>
      `;
      subtotalEl.textContent = '₹0.00';
      totalEl.textContent = '₹0.00';
      checkoutBtn.disabled = true;
      return;
    }

    checkoutBtn.disabled = false;
    list.innerHTML = '';
    let grandTotal = 0;

    cart.forEach(item => {
      const itemTotal = Number(item.price) * item.qty;
      grandTotal += itemTotal;
      const card = document.createElement('div');
      card.className = 'cart-item-card';

      const formattedPrice = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(item.price);
      const imgSrc = item.primaryImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80';

      card.innerHTML = `
        <img src="${imgSrc}" alt="${item.name}" class="cart-item-img" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          ${item.selectedVariant ? `<p style="font-size:0.75rem; color:var(--color-text-muted); margin-bottom:4px;">${item.selectedVariant}</p>` : ''}
          <div class="cart-item-price">${formattedPrice}</div>
          <div class="cart-qty-control">
            <button class="cart-qty-btn qty-minus" aria-label="Decrease quantity">−</button>
            <span class="cart-qty-val">${item.qty}</span>
            <button class="cart-qty-btn qty-plus" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" aria-label="Remove item">&times;</button>
      `;

      card.querySelector('.qty-minus').addEventListener('click', () => {
        if (onUpdateQty) onUpdateQty(item.id, item.qty - 1);
      });

      card.querySelector('.qty-plus').addEventListener('click', () => {
        if (onUpdateQty) onUpdateQty(item.id, item.qty + 1);
      });

      card.querySelector('.cart-item-remove').addEventListener('click', () => {
        if (onRemoveItem) onRemoveItem(item.id);
      });

      list.appendChild(card);
    });

    const formattedGrandTotal = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(grandTotal);
    subtotalEl.textContent = formattedGrandTotal;
    totalEl.textContent = formattedGrandTotal;
  }

  // Initial render
  renderCart();

  return {
    element: container,
    open: openDrawer,
    close: closeDrawer,
    update(newCart) {
      cart = newCart || [];
      renderCart();
    }
  };
}
