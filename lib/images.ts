const galleryLength = 140;
const galleryEndpoint = "https://imagedelivery.net/2N0Ig6g7iTFdsgeeMFiVOw";

const imageId = "wedding/cabe-saki-wedding";

export const imageCollection = Array.from(
  { length: galleryLength },
  (_, index) => `${galleryEndpoint}/${imageId}-${index + 1}.jpg`
);
