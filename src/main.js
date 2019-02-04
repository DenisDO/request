/* global FilesList utils HttpRequest onUploadProgress onDownloadProgress isImageFormat Notification */
const [uploadForm] = document.getElementsByClassName('uploadForm');
const [downloadForm] = document.getElementsByClassName('downloadForm');
const [downloadInput] = document.getElementsByClassName('downloadForm__text');
const [uploadFileSelector] = document.getElementsByClassName('uploadForm__file');
const [uploadContent] = document.getElementsByClassName('uploadForm__content__text');
const [uploadFormContent] = document.getElementsByClassName('uploadForm__content');
const [filesWrapper] = document.getElementsByClassName('files__wrapper');
const [notifyWrapper] = document.getElementsByClassName('notifications__wrapper');
const [downloadButton] = document.getElementsByClassName('downloadForm__button');
const [uploadButton] = document.getElementsByClassName('uploadButton');

const filesList = new FilesList(filesWrapper);
filesList.addListener(chooseFileFromList);
const notify = new Notification(notifyWrapper);
const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });

function chooseFileFromList(event) {
  const element = event.target;

  if (element.tagName === 'LI') {
    downloadInput.value = element.innerHTML;
    utils.enableElement([downloadButton]);
  }
}

function onInputFileNameChange({ target }) {
  if (target.value) {
    utils.enableElement([downloadButton]);
    notify.info(`You can download the file ${target.value}!`);
  } else {
    utils.disableElement([downloadButton]);
    notify.warning('There is not file for download!');
  }
}

function onFileSelect(e) {
  const fileName = e.target.value.replace(/.*\\/, '');

  if (fileName) {
    utils.enableElement([uploadButton]);
    uploadContent.innerHTML = fileName;
    notify.info(`The file ${fileName} is ready for upload!`);
  } else {
    utils.disableElement([uploadButton]);
    uploadContent.innerHTML = 'Choose your file';
    notify.error('No file selected!');
  }
}

function onFileUploadSubmit(e) {
  e.preventDefault();
  const [file] = e.target.sampleFile.files;

  if (!utils.isValidFile(file.name)) {
    notify.error(`${file.name} is forbidden file!`);
    notify.warning('The file should not start with a dot and not contain forbidden characters!');
    return;
  }

  const data = new FormData();
  data.append('sampleFile', file);

  utils.disableElement([uploadFormContent, uploadFileSelector, uploadButton, downloadButton, downloadInput]);
  xhr.post('/upload', { responseType: 'blob', onUploadProgress, data })
    .then(() => {
      utils.enableElement([uploadFormContent, uploadFileSelector, downloadInput]);
      filesList.load().then(filesList.render());
      notify.info(`File ${file.name} was uploaded!`);
    })
    .catch(xhr => {
      utils.enableElement([uploadFormContent, uploadFileSelector]);
      notify.error(`Error: ${xhr.statusText}`);
    });
  uploadContent.innerHTML = 'Choose your file';
}

function onFileDownloadSubmit(e) {
  e.preventDefault();
  const file = e.target[0].value;
  downloadInput.value = '';

  if (!utils.isValidFile(file)) {
    notify.error(`${file} is forbidden file!`);
    notify.warning('The file should not start with a dot and not contain forbidden characters!');
    return;
  }

  utils.disableElement([downloadButton, downloadInput, uploadFormContent, uploadFileSelector]);
  xhr.get(`/files/${file}`, { responseType: 'blob', onDownloadProgress })
    .then(data => {
      const dataType = data.type;

      if (utils.isImageFormat(dataType)) {
        utils.showImage(data, dataType);
        notify.info('Image is downloaded!');
      } else {
        utils.downloadFile(data, dataType);
        notify.info('The file may be downloaded to Your device!');
      }

      utils.enableElement([downloadInput, uploadFormContent, uploadFileSelector]);
    })
    .catch(xhr => {
      utils.enableElement([downloadInput, uploadFormContent, uploadFileSelector]);
      notify.error(`Error: ${xhr.statusText}`);
    });
}

uploadForm.onsubmit = onFileUploadSubmit;
downloadForm.onsubmit = onFileDownloadSubmit;
downloadInput.onchange = onInputFileNameChange;
uploadFileSelector.onchange = onFileSelect;