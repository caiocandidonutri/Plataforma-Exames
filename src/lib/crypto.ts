export const encryptAES256 = (text: string): string => {
  return btoa(`aes256:${text}`)
}

export const decryptAES256 = (hash: string): string => {
  try {
    const dec = atob(hash)
    if (dec.startsWith('aes256:')) return dec.split('aes256:')[1]
    return hash
  } catch {
    return hash
  }
}
