/**
 * Notifications toast — style Asmad (carte, accent coloré, icône)
 * Utilise Bootstrap Toast pour l’animation d’apparition / disparition
 */
import { Toast } from 'bootstrap';

const TYPE_META = {
  success: {
    modifier: 'asmad-toast--success',
    icon: '<i class="ai-check-circle" aria-hidden="true"></i>',
  },
  error: {
    modifier: 'asmad-toast--error',
    icon: '<i class="ai-alert-circle" aria-hidden="true"></i>',
  },
  danger: {
    modifier: 'asmad-toast--error',
    icon: '<i class="ai-alert-circle" aria-hidden="true"></i>',
  },
  warning: {
    modifier: 'asmad-toast--warning',
    icon: '<i class="ai-alert-triangle" aria-hidden="true"></i>',
  },
  info: {
    modifier: 'asmad-toast--info',
    icon: '<i class="ai-info-circle" aria-hidden="true"></i>',
  },
};

/**
 * @param {string} message
 * @param {string} type
 * @param {number} duration
 * @param {{ title?: string }} [options]
 */
export function showToast(message, type = 'info', duration = 3000, options = {}) {
  const titleText = options.title || 'Notification';
  const meta = TYPE_META[type] || TYPE_META.info;

  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className =
      'toast-container position-fixed asmad-toast-stack p-3';
    toastContainer.style.cssText =
      'z-index:9999;top:5.25rem;right:0.75rem;max-width:min(100vw - 1.5rem, 26rem);pointer-events:none';
    document.body.appendChild(toastContainer);
  }

  const toastEl = document.createElement('div');
  toastEl.className = `toast asmad-toast ${meta.modifier}`;
  toastEl.setAttribute('role', 'alert');
  toastEl.setAttribute('aria-live', 'polite');
  toastEl.setAttribute('aria-atomic', 'true');
  toastEl.style.pointerEvents = 'auto';

  const inner = document.createElement('div');
  inner.className = 'asmad-toast__inner';

  const iconWrap = document.createElement('div');
  iconWrap.className = 'asmad-toast__icon';
  iconWrap.setAttribute('aria-hidden', 'true');
  iconWrap.innerHTML = meta.icon;

  const body = document.createElement('div');
  body.className = 'asmad-toast__body';

  const titleEl = document.createElement('div');
  titleEl.className = 'asmad-toast__title';
  titleEl.textContent = titleText;

  const msgEl = document.createElement('p');
  msgEl.className = 'asmad-toast__message';
  msgEl.textContent = message;

  body.appendChild(titleEl);
  body.appendChild(msgEl);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'btn-close asmad-toast__close';
  closeBtn.setAttribute('data-bs-dismiss', 'toast');
  closeBtn.setAttribute('aria-label', 'Fermer');

  inner.appendChild(iconWrap);
  inner.appendChild(body);
  inner.appendChild(closeBtn);
  toastEl.appendChild(inner);

  toastContainer.appendChild(toastEl);

  const toastInstance = new Toast(toastEl, {
    autohide: true,
    delay: duration,
    animation: true,
  });

  toastInstance.show();

  toastEl.addEventListener(
    'hidden.bs.toast',
    () => {
      toastEl.remove();
      if (toastContainer.children.length === 0) {
        toastContainer.remove();
      }
    },
    { once: true },
  );
}

export const toast = {
  success: (message, duration = 3000) => showToast(message, 'success', duration),
  error: (message, duration = 3000) => showToast(message, 'error', duration),
  warning: (message, duration = 3000) => showToast(message, 'warning', duration),
  info: (message, duration = 3000) => showToast(message, 'info', duration),
  cart: (message, duration = 3500) =>
    showToast(message, 'success', duration, { title: 'Panier' }),
};

/**
 * @param { { role?: string; firstName?: string; email?: string } } user
 */
export function showLoginWelcomeToast(user) {
  if (!user) return;
  const role = (user.role || '').toLowerCase();
  const first =
    (user.firstName && String(user.firstName).trim()) ||
    (user.email && String(user.email).split('@')[0]) ||
    '';
  const hello = first ? `Bienvenue, ${first} !` : 'Bienvenue !';
  let suffix = '';
  switch (role) {
    case 'admin':
      suffix = ' Espace administration.';
      break;
    case 'seller':
      suffix = ' Espace vendeur.';
      break;
    case 'client':
    default:
      suffix = ' Heureux de vous retrouver sur Asmad.';
      break;
  }
  showToast(`${hello}${suffix}`, 'success', 4500, { title: 'Connexion' });
}

/**
 * @param { { firstName?: string; email?: string } } user
 */
export function showSignupWelcomeToast(user) {
  if (!user) return;
  const first =
    (user.firstName && String(user.firstName).trim()) ||
    (user.email && String(user.email).split('@')[0]) ||
    '';
  const msg = first
    ? `Bienvenue, ${first} ! Votre compte est prêt — bon shopping sur Asmad.`
    : 'Bienvenue ! Votre compte est prêt — bon shopping sur Asmad.';
  showToast(msg, 'success', 4500, { title: 'Compte créé' });
}
