export const delay = () => new Promise((resolve) => setTimeout(resolve, 2000));

export const succeededJob = () => {
  const statusCode = Math.random();

  if (statusCode < 0.2) return 'success';
  if (statusCode < 0.7) return 'pending';
  return 'failure';
};
