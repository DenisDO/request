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
const [enabledState, disabledState] = ['enabled', 'disabled'];

const filesList = new FilesList(filesWrapper, chooseFileFromList);
const notify = new Notification(notifyWrapper);
const xhr = new HttpRequest({ baseUrl: 'http://localhost:8000' });

function changeElementsState(elements, state) {
  const oldClassName = state ? disabledState : enabledState;
  const newClassName = state ? enabledState : disabledState;

  elements.forEach(element => {
    if (element.className.includes(oldClassName)) {
      element.className = element.className.replace(oldClassName, newClassName);
    }
    element.disabled = !state;
  });
}

function showImage(data, imageType, fileName) {
  const imageURL = URL.createObjectURL(data, { type: imageType });
  const [image] = document.getElementsByClassName('image');
  image.style.display = 'inline-block';
  image.src = imageURL;
  image.alt = fileName;
}

function downloadFile(data, fileType) {
  const downloadElement = document.createElement('a');
  downloadElement.style.display = 'none';
  document.body.appendChild(downloadElement);
  const downloadURL = URL.createObjectURL(data, { type: fileType });
  downloadElement.href = downloadURL;
  downloadElement.download = fileType;
  downloadElement.click();
  document.body.removeChild(downloadElement);
}

function chooseFileFromList({ target }) {
  downloadInput.value = target.innerHTML;
  changeElementsState([downloadButton], true);
}

function onInputFileNameChange({ target }) {
  if (target.value) {
    changeElementsState([downloadButton], true);
    notify.info(`You can download the file ${target.value}!`);
  } else {
    changeElementsState([downloadButton], false);
    notify.warning('There is not file for download!');
  }
}

function onFileSelect(e) {
  const fileName = e.target.value.replace(/.*\\/, '');

  if (fileName) {
    changeElementsState([uploadButton], true);
    uploadContent.innerHTML = fileName;
    notify.info(`The file ${fileName} is ready for upload!`);
  } else {
    changeElementsState([uploadButton], false);
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

  changeElementsState([uploadFormContent, uploadFileSelector, uploadButton, downloadButton, downloadInput], false);
  xhr.post('/upload', { responseType: 'blob', onUploadProgress, data })
    .then(() => {
      changeElementsState([uploadFormContent, uploadFileSelector, downloadInput], true);
      filesList.init();
      notify.info(`File ${file.name} was uploaded!`);
    })
    .catch(xhr => {
      changeElementsState([uploadFormContent, uploadFileSelector], true);
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

  changeElementsState([downloadButton, downloadInput, uploadFormContent, uploadFileSelector], false);
  xhr.get(`/files/${file}`, { responseType: 'blob', onDownloadProgress })
    .then(data => {
      const dataType = data.type;

      if (utils.isImageFormat(dataType)) {
        showImage(data, dataType);
        notify.info('Image is downloaded!');
      } else {
        downloadFile(data, dataType);
        notify.info('The file may be downloaded to Your device!');
      }

      changeElementsState([downloadInput, uploadFormContent, uploadFileSelector], true);
    })
    .catch(xhr => {
      changeElementsState([downloadInput, uploadFormContent, uploadFileSelector], true);
      notify.error(`Error: ${xhr.statusText}`);
    });
}

uploadForm.onsubmit = onFileUploadSubmit;
downloadForm.onsubmit = onFileDownloadSubmit;
downloadInput.onchange = onInputFileNameChange;
uploadFileSelector.onchange = onFileSelect;