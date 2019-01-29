/* eslint-disable */
const [INFO, ERROR, WARNING] = ['INFO', 'ERROR', 'WARNING'];

const createWrapper = function() {
  const wrapper = document.createElement('div');
  wrapper.className = 'notifications__wrapper';
  wrapper.id = 'notifyWrapper';
  document.querySelector('body').appendChild(wrapper);
};

class Notification {
  constructor(type, text) {
    this.type = type;
    this.text = text;

    if (!document.getElementById('notifyWrapper')) {
      createWrapper();
    }
    this.parent = document.getElementById('notifyWrapper');
  }

  showNotify() {
    const notify = document.createElement('div');

    const header = document.createElement('div');
    const headerIcon = document.createElement('i');
    const headerText = document.createElement('h3');

    const body = document.createElement('div');
    const bodyText = document.createElement('span');

    notify.className = 'notify';
    headerText.className = 'notify__header__text';
    body.className = 'notify__body';
    bodyText.className = 'notify__body__text';

    switch (this.type) {
    case INFO:
      header.className = 'notify__header notify--info';
      headerIcon.className = 'notify__header__icon fas fa-info-circle';
      break;
    case WARNING:
      header.className = 'notify__header notify--warning';
      headerIcon.className = 'notify__header__icon fas fa-exclamation-triangle';
      break;
    case ERROR:
      header.className = 'notify__header notify--error';
      headerIcon.className = 'notify__header__icon fas fa-exclamation-circle';
      break;
    }
    headerText.innerHTML = this.type;
    bodyText.innerHTML = this.text;

    header.appendChild(headerIcon);
    header.appendChild(headerText);
    body.appendChild(bodyText);
    notify.appendChild(header);
    notify.appendChild(body);
    this.parent.appendChild(notify);

    setTimeout(this.removeNotify, 10000, this.parent, notify);
  }

  removeNotify(parent, notify) {
    parent.removeChild(notify);
  }
}

const firstNotify = new Notification(INFO, `It was made with info!`);
const secondNotify = new Notification(WARNING, 'It was made with warning!');
const thirdNotify = new Notification(ERROR, 'It was made with error!');