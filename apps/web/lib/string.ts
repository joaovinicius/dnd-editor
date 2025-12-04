import DOMPurify from 'isomorphic-dompurify';

const randomString = (length: number = 8) => {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  return Array.from(array, (byte) => characters[byte % characters.length]).join(
    ''
  );
};

function sanitizedContent(content: string) {
  return DOMPurify.sanitize(content);
}

function isHTML(str: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

export { randomString, sanitizedContent, isHTML };
