/** Return a random int between - spreadRange and + spreadRange */
export const randSymmetricInt = (spreadRange: number) => {
  /*
    s = 5,
    r = 0.3

    f(rand, s) = floor(rand * s * 2 - s)
    floor(s (rand * 2 - 1))

    fl((0.3) * 5 * 2 - 5).

    fl(1.5 * 2 - 5)
    fl(3 - 5)
    fl(-2)
    -2

    fl(5 * (0.3 * 2 - 1))
    fl(5 * (0.6 - 1))
    fl(5 * (-0.4))
    fl(-2)
  */
  return Math.floor((Math.random() * 2 - 1) * spreadRange)
}