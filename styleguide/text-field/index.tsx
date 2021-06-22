import { forwardRef } from 'react'
import clsx from 'clsx'
import { Field, FastField, FieldProps, FastFieldProps } from 'formik'
import { TextField as MuiTextField, OutlinedTextFieldProps } from '@material-ui/core'

/**
 * please note that this solution is not optimal for larger-scale apps
 *
 * the reason is that the TextField component below adjusts the default
 * MUI's TextField look AND integrates Formik, which is bad for maintenance
 * and usage where automatic integration with Formik may not be desired
 *
 * a better solution is to create two separate components - one that adjusts
 * the look and another that integrates Formik with the adjusted text field
 */

type Props = Omit<OutlinedTextFieldProps, 'name' | 'variant'> & {
  name: string
  fast?: boolean
  onAfterChange?: () => void | Promise<void>
}

export const TextField: React.ForwardRefExoticComponent<Props> = forwardRef<
  HTMLDivElement,
  Props
>(({ name, fast, onAfterChange, fullWidth = true, className, ...rest }, ref) => {
  const FieldComponent = fast ? FastField : Field

  return (
    <FieldComponent name={name}>
      {({
        field: { onChange, ...fieldRest },
        meta,
        form,
      }: FieldProps | FastFieldProps) => (
        <MuiTextField
          ref={ref}
          {...rest}
          {...fieldRest}
          fullWidth={fullWidth}
          variant="outlined"
          className={clsx('relative', {
            [className!]: !!className,
          })}
          onChange={e => {
            onChange(e)
            onAfterChange?.()
            form.setFieldTouched(name, true)
          }}
          error={!!meta.error && meta.touched}
          helperText={meta.touched ? meta.error : ''}
          FormHelperTextProps={{
            ...rest.FormHelperTextProps,
            className: 'absolute -bottom-5',
          }}
        />
      )}
    </FieldComponent>
  )
})

TextField.displayName = 'TextField'
