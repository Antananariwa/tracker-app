import './Button.css'

type ButtonProps = {
  children: React.ReactNode
  variant?: 'secondary'
  className?: string
  onClick?: () => void
  disabled?: boolean
}

const Button = ({ children, variant, className = '', onClick, disabled = false }: ButtonProps) => {
  return (
    <button className={`btn btn-${variant} ${className}`} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  )
}

export default Button
