/** A generic no-arg function that returns a random value of type T on each call. */
export type RNDFunction<T> = () => T;

/** A generic function that returns an interpolated value of type T on each call. */
export type InterpolateFunction<T> = (t: number) => T;
