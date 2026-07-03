export const generateUniqueId = (prefix: string) => {
  const rand = Math.floor(Math.random() * 100000000);
  return `${prefix}-${Date.now()}-${rand}`;
};
