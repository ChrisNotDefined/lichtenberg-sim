/** Return a random int between - spreadRange and + spreadRange */
export const randSymmetricInt = (spreadRange: number) => {
  /*
    s = 5,
    r = 0.8

    f(rand, s) = floor(rand * s * 2 - s)
    floor(s (rand * 2 - 1))

    fl((0.8) * 5 * 2 - 5).
    fl(4 * 2 - 5)
    fl(8 - 5)
    fl(3)
    3

    fl(5 * (0.8 * 2 - 1))
    fl(5 * (1.6 - 1))
    fl(5 * (0.6))
    fl(3)
  */
  return Math.floor((Math.random() * 2 - 1) * spreadRange)
}