export const isMobile = () =>
  typeof window !== "undefined" &&
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

export const isAndroid = () =>
  typeof window !== "undefined" && /Android/i.test(navigator.userAgent);

export const isIOS = () =>
  typeof window !== "undefined" &&
  /(iPhone|iPad|iPod)/i.test(navigator.userAgent);

export const deepLink = "https://app.eldik.kg/credit_application";
export const googlePlayUrl =
  "https://play.google.com/store/apps/details?id=kg.rsk.staging&hl=ru";
export const appStoreUrl =
  "https://apps.apple.com/kg/app/eldik/id6596756225";

export const openDeepLink = () => {
  const isIOSDevice = isIOS();
  const isAndroidDevice = isAndroid();
  let timer: any;

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      clearTimeout(timer);
    }
  };

  document.addEventListener("visibilitychange", onVisibilityChange);

  // iOS
  if (isIOSDevice) {
    window.location.href = deepLink;

    timer = setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.location.href = appStoreUrl;
    }, 1500);

    return;
  }

  // ANDROID
  if (isAndroidDevice) {
    const start = Date.now();

    window.location.href = deepLink;

    timer = setTimeout(() => {
      if (Date.now() - start < 1500) {
        window.location.href = googlePlayUrl;
      }
    }, 1200);

    return;
  }

  // Desktop fallback
  window.location.href = "/online-credit";
};

