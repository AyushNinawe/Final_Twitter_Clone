// Safe, robust storage adapter that works in all browser environments (regular, iframes, and sandboxes)
const createSafeStorage = () => {
  let memoryFallback = {};

  const getStorageObj = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Test write to ensure no QuotaExceeded or SecurityError in sandboxed iframe
        const testKey = "__storage_test__";
        window.localStorage.setItem(testKey, "1");
        window.localStorage.removeItem(testKey);
        return window.localStorage;
      }
    } catch {
      // In sandboxed iframe, localStorage access might throw SecurityError
    }
    return null;
  };

  return {
    getItem: (key) => {
      return new Promise((resolve) => {
        const storage = getStorageObj();
        if (storage) {
          try {
            resolve(storage.getItem(key));
            return;
          } catch {
            // fallthrough
          }
        }
        resolve(Object.prototype.hasOwnProperty.call(memoryFallback, key) ? memoryFallback[key] : null);
      });
    },
    setItem: (key, value) => {
      return new Promise((resolve) => {
        const storage = getStorageObj();
        if (storage) {
          try {
            storage.setItem(key, value);
            resolve();
            return;
          } catch {
            // fallthrough
          }
        }
        memoryFallback[key] = String(value);
        resolve();
      });
    },
    removeItem: (key) => {
      return new Promise((resolve) => {
        const storage = getStorageObj();
        if (storage) {
          try {
            storage.removeItem(key);
            resolve();
            return;
          } catch {
            // fallthrough
          }
        }
        delete memoryFallback[key];
        resolve();
      });
    },
  };
};

export default createSafeStorage();
