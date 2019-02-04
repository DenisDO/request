(function() {
  const [INFO, ERROR, WARNING] = ['INFO', 'ERROR', 'WARNING'];
  const notifyDataType = {
    [INFO]: {
      name: INFO,
      className: 'info',
      icon: 'info-circle'
    },
    [WARNING]: {
      name: WARNING,
      className: 'warning',
      icon: 'exclamation-triangle'
    },
    [ERROR]: {
      name: ERROR,
      className: 'error',
      icon: 'exclamation-circle'
    }
  };

  function renderNotify(type, text) {
    return `
    <div class="notify notify--${notifyDataType[type].className}">
      <div class="notify__header">
        <i class="notify__header__icon fas fa-${notifyDataType[type].icon}"></i>
        <h3 class="notify__header__text">${notifyDataType[type].name}</h3>
      </div>
      <div class="notify__body">
        <span class="notify__body__text">${text}</span>
      </div>
    </div>
    `;
  }

  class Notification {
    constructor(nodeElement) {
      if (!nodeElement) {
        throw new Error('Missing argument');
      }
      this.parent = nodeElement;
    }

    __render(type, text, time = 5000) {
      const notify = document.createElement('div');
      notify.innerHTML = renderNotify(type, text);
      this.parent.appendChild(notify);
      setTimeout(this.removeNotify, time, this.parent, notify);
    }

    info(text, time) {
      this.__render(INFO, text, time);
    }

    warning(text, time) {
      this.__render(WARNING, text, time);
    }

    error(text, time) {
      this.__render(ERROR, text, time);
    }

    removeNotify(parent, notify) {
      parent.removeChild(notify);
    }
  }

  window.Notification = Notification;
}());