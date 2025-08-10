import styles from './Badge.module.css';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge = ({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: Props) => {
  return (
    <div
      className={`${styles.badge} ${styles[variant]} ${styles[size]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};
