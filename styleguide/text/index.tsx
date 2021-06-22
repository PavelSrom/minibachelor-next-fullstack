import { CSSProperties } from 'react'
import clsx from 'clsx'

type Variant = 'h1' | 'h2' | 'body' | 'body2' | 'caption'
type ReturnElement = 'h1' | 'h2' | 'p' | 'span'

const elements: Record<Variant, ReturnElement> = {
  h1: 'h1',
  h2: 'h2',
  body: 'p',
  body2: 'p',
  caption: 'span',
}

const classes: Record<Variant, string> = {
  h1: 'text-3xl font-semibold',
  h2: 'text-xl font-semibold',
  body: 'text-base font-light',
  body2: 'text-sm font-light',
  caption: 'text-xs font-light',
}

type Props = {
  variant?: Variant
  className?: string
  style?: CSSProperties
}

export const Text: React.FC<Props> = ({
  variant = 'body',
  className,
  style,
  children,
}) => {
  const Element = elements[variant]

  return (
    <Element
      className={clsx(classes[variant], {
        [className!]: !!className,
      })}
      style={style}
    >
      {children}
    </Element>
  )
}
