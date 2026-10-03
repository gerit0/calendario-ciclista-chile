// Setup global mocks for Vitest (jsdom)

if (typeof window !== 'undefined') {
  window.SUPABASE_URL = 'https://mhzktzvxdmhanqkhhaqm.supabase.co';
  window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key_for_testing';

  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = () => 'blob:http://localhost/dummy-blob';
    window.URL.revokeObjectURL = () => {};
  }

  if (!window.alert) window.alert = () => {};
  if (!window.confirm) window.confirm = () => true;

  // Mock de Canvas para image compression tests
  if (!HTMLCanvasElement.prototype.getContext) {
    HTMLCanvasElement.prototype.getContext = () => ({
      drawImage: () => {},
      getImageData: () => ({ data: [] })
    });
  }
  if (!HTMLCanvasElement.prototype.toBlob) {
    HTMLCanvasElement.prototype.toBlob = function(callback, type) {
      callback(new Blob(['dummy-image-data'], { type: type || 'image/webp' }));
    };
  }
}
