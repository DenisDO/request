/* global HttpRequest Notification */
(function() {
  const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });
  const [notifyWrapper] = document.getElementsByClassName('notifications__wrapper');
  const notify = new Notification(notifyWrapper);

  function render(list) {
    return `
      <header>
        <h2 class="files__header">List of files:</h2>
      </header>
      <section class="files__content">
        <ul class="filesList__container">
          ${list.map(text => `<li class="filesList__item">${text}</li>`).join('\n')}
        </ul>
      </section>
    `;
  }

  class FilesList {
    constructor(nodeElement, itemsCallback) {
      if (!nodeElement) {
        throw new Error('Missing argument');
      }
      this.parent = nodeElement;
      this.itemsCallback = itemsCallback;
      this.data = [];
      this.init();
    }

    init() {
      this.load()
        .then(() => {
          this.render();
          notify.info('File list is updated!');
        })
        .then(() => {
          this.addListenerToItems(this.callback);
        });
    }

    addListenerToItems() {
      const [filesContainer] = document.getElementsByClassName('filesList__container');
      const { children } = filesContainer;

      for (const key of children) {
        key.addEventListener('click', this.itemsCallback);
      }
    }

    load() {
      return xhr
        .get('/list', { responseType: 'json' })
        .then(data => {
          this.data = data;
        })
        .catch(xhr => notify.error(`Error: ${xhr.statusText}`));
    }

    render() {
      this.parent.innerHTML = render(this.data);
    }
  }

  window.FilesList = FilesList;
})();
