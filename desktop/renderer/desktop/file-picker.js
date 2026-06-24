(function () {
  'use strict';
  if (!window.cytomoveDesktop?.chooseLocalImages) return;
  if (window.CYTOMOVE_USE_NATIVE_FILE_PICKER !== true) return;

  function bytesToUint8Array(bytes) {
    if (!bytes) throw new Error('Selected image has no readable data.');
    if (bytes instanceof Uint8Array) return bytes;
    if (bytes instanceof ArrayBuffer) return new Uint8Array(bytes);
    if (Array.isArray(bytes)) return new Uint8Array(bytes);
    if (bytes.type === 'Buffer' && Array.isArray(bytes.data)) return new Uint8Array(bytes.data);
    if (ArrayBuffer.isView(bytes)) return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    throw new Error('Selected image data could not be decoded.');
  }

  async function chooseImages() {
    const selected = await window.cytomoveDesktop.chooseLocalImages();
    if (!selected?.length) return;
    const files = selected.map(item => new File(
      [bytesToUint8Array(item.bytes)],
      item.name,
      { type: item.type }
    ));
    window.dispatchEvent(new CustomEvent('cytomove:desktop-files-selected', {
      detail: { files }
    }));
  }

  document.addEventListener('click', event => {
    const trigger = event.target?.closest?.('#openFile, #addImageGroup, [onclick*="fileInput"]');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    chooseImages().catch(error => {
      window.dispatchEvent(new CustomEvent('cytomove:desktop-file-error', {
        detail: { message: error?.message || String(error) }
      }));
    });
  }, true);
}());
