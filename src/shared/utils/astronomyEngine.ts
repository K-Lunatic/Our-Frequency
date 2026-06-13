const deg2rad = (deg: number) => (deg * Math.PI) / 180.0;

export function getSunLongitude(date: Date): number {
  const jd = (date.getTime() / 86400000.0) + 2440587.5;
  const t = (jd - 2451545.0) / 36525.0;
  let l0 = 280.46646 + 36000.76983 * t + 0.0003032 * t * t;
  l0 = l0 % 360.0;
  if (l0 < 0) l0 += 360.0;

  let m = 357.52911 + 35999.05029 * t - 0.0001537 * t * t;
  m = m % 360.0;
  if (m < 0) m += 360.0;

  const mRad = deg2rad(m);

  const c =
    (1.914602 - 0.004817 * t - 0.000014 * t * t) * Math.sin(mRad) +
    (0.019993 - 0.000101 * t) * Math.sin(2 * mRad) +
    0.000289 * Math.sin(3 * mRad);

  const trueLon = l0 + c;

  const omega = 125.04 - 1934.136 * t;
  const omegaRad = deg2rad(omega);
  let apparentLon = trueLon - 0.00569 - 0.00478 * Math.sin(omegaRad);

  apparentLon = apparentLon % 360.0;
  if (apparentLon < 0) apparentLon += 360.0;

  return apparentLon;
}