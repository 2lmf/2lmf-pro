/**
 * SharpShark Wine Cart Logic
 * Simple, fast, LocalStorage based.
 */

const CART_STORAGE_KEY = 'sharpshark_wine_cart';

class WineCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
        this.isOpen = false;

        this.initUI();
        this.render();
    }

    // --- Core Logic ---

    addItem(product, quantity = 1) {
        const existing = this.items.find(i => i.id === product.id);
        if (existing) {
            existing.qty += quantity;
        } else {
            this.items.push({ ...product, qty: quantity });
        }
        this.save();
        this.render();
        this.openDrawer();
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
        this.render();
    }

    updateQty(id, change) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.qty += change;
            if (item.qty <= 0) {
                this.removeItem(id);
            } else {
                this.save();
                this.render();
            }
        }
    }

    save() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    // --- UI Management ---

    initUI() {
        // Create Floating Button if not exists (in case not in HTML)
        if (!document.getElementById('cart-float-btn')) {
            const btn = document.createElement('div');
            btn.id = 'cart-float-btn';
            btn.innerHTML = `<span class="cart-icon">🛒</span><span class="cart-badge" id="cart-badge-count">0</span>`;
            btn.onclick = () => this.toggleDrawer();
            document.body.appendChild(btn);
        }

        // Create Drawer Structure
        if (!document.getElementById('cart-drawer')) {
            const drawer = document.createElement('div');
            drawer.id = 'cart-drawer';
            drawer.innerHTML = `
                <div class="cart-header">
                    <h2>Vaša Košarica 🍷</h2>
                    <button class="close-cart-btn" onclick="cart.toggleDrawer()">&times;</button>
                </div>
                <div class="cart-items" id="cart-items-container">
                    <!-- Items go here -->
                </div>
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Ukupno:</span>
                        <span class="total-amount" id="cart-total-display">0.00 €</span>
                    </div>
                    <button class="btn-checkout" onclick="cart.checkout()">Završi Narudžbu</button>
                </div>
            `;
            document.body.appendChild(drawer);

            // Overlay
            const overlay = document.createElement('div');
            overlay.id = 'cart-overlay';
            overlay.onclick = () => this.closeDrawer();
            document.body.appendChild(overlay);
        }
    }

    render() {
        const container = document.getElementById('cart-items-container');
        const badge = document.getElementById('cart-badge-count');
        const totalDisplay = document.getElementById('cart-total-display');

        // Update Badge
        const totalCount = this.items.reduce((sum, item) => sum + item.qty, 0);
        if (badge) {
            badge.innerText = totalCount;
            // Pop Animation
            badge.classList.remove('pop-anim');
            void badge.offsetWidth; // Trigger reflow
            badge.classList.add('pop-anim');
        }

        // Update Total
        if (totalDisplay) totalDisplay.innerText = this.getTotal().toFixed(2) + ' €';

        // Render Items
        if (!container) return;

        container.innerHTML = '';

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Košarica je prazna.<br>Dodajte neka vrhunska vina!</div>';
            return;
        }

        this.items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <span class="cart-item-price">${item.price.toFixed(2)} €</span>
                </div>
                <div class="cart-controls">
                    <button class="qty-btn" onclick="cart.updateQty('${item.id}', -1)">&#9664;</button>
                    <span class="cart-qty-display">${item.qty}</span>
                    <button class="qty-btn" onclick="cart.updateQty('${item.id}', 1)">&#9654;</button>
                </div>
                <div class="remove-btn" onclick="cart.removeItem('${item.id}')">&times;</div>
            `;
            container.appendChild(el);
        });
    }

    toggleDrawer() {
        if (this.isOpen) this.closeDrawer();
        else this.openDrawer();
    }

    openDrawer() {
        document.getElementById('cart-drawer').classList.add('open');
        document.getElementById('cart-overlay').classList.add('show');
        this.isOpen = true;
    }

    closeDrawer() {
        document.getElementById('cart-drawer').classList.remove('open');
        document.getElementById('cart-overlay').classList.remove('show');
        this.isOpen = false;
    }

    checkout() {
        if (this.items.length === 0) {
            alert("Košarica je prazna!");
            return;
        }
        // Save order to temporary storage for checkout page or just open modal
        // For now, simple alert or redirect
        alert("Preusmjeravanje na naplatu... (Backend integracija u tijeku)");
        console.log("Checkout Order:", this.items);
    }
}

// Global instance
const cart = new WineCart();

// Example usage function for buttons
function addToCart(id, name, price) {
    cart.addItem({ id, name, price });
}
