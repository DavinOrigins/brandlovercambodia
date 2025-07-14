export const contactSeller = () => {
  const telegramUsername = "Be_LinTo" // Replace with your real Telegram username
  const message = encodeURIComponent("Hi, I am interested in your car interior products.")
  const telegramLink = `https://t.me/${telegramUsername}?text=${message}`

  window.open(telegramLink, "_blank")
}
