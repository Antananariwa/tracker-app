import './Header.css'

type HeaderProps = {
  title?: string
  subtitle?: string
}

const Header = ({title = "", subtitle = ""}: HeaderProps) => {
  return (
    <header className="header">
      {title && <h1>{title}</h1>}
      {subtitle && <h2>{subtitle}</h2>}
    </header>
  )
}

export default Header