async function shakeX(target?: Element | null) {
  await target?.animate?.(
    {
      transform: [
        'translateX(0)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-10px)',
        'translateX(10px)',
        'translateX(-10px)',
        'translateX(0)',
      ],
      offset: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
    },
    {
      duration: 1000,
      iterations: 1,
    }
  )?.finished;
}
export { shakeX };
