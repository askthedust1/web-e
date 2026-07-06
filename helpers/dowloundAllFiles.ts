interface Props {
  link: string
}

export const dowloundAllFiles = (urls: Props[]) => {
  for (const url of urls) {
    window.open(url.link)
  }
}
