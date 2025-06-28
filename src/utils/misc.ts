export const doNTimes = (n: number, fn: (runCount: number) => void) => {
  for (let i = 0; i < n; i++) {
    fn(i);
  }
}
