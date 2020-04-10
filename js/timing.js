
export function delay({ ms }) {
  return (arg1, arg2, arg3) => new Promise((resolve) => {
    setTimeout(resolve, ms, arg1, arg2, arg3);
  });
}
