import classNames from 'classnames/dedupe'
import React from 'react'
import { setDefaultProps } from '../../lib/utils'

import TextInput from '../text-input'

type SelectProps<
  TOptions extends readonly {
    label: string
    value: string
    disabled?: boolean
  }[],
  TValue extends PickPropAsUnion<TOptions, 'value'>
> = {
  children?: any
  className?: any
  value?: TOptions extends readonly {
    label: string
    value: TValue
    disabled?: boolean
  }[]
    ? TValue
    : never
  options?: TOptions
  onChange?: (value: PickPropAsUnion<TOptions, 'value'>) => any
  disabled?: boolean
  multiple?: boolean
  valid?: boolean
  required?: boolean
} & React.HTMLAttributes<HTMLSelectElement>

function Select<
  TOptions extends readonly {
    label: string
    value: string
    disabled?: boolean
  }[],
  TValue extends PickPropAsUnion<TOptions, 'value'>
>(
  {
    children,
    value,
    className,
    options,
    onChange,
    multiple,
    disabled,
    valid,
    ...props
  }: SelectProps<TOptions, TValue>,
  ref: React.ForwardedRef<HTMLSelectElement>
) {
  const activeClasses =
    'border-gray-3 hover:border-gray-4 focus:border-primary-5'
  const invalidClasses = 'border-red-5 focus:border-red-5 hover:border-red-5'
  const disabledClasses = 'border-dark-tertiary bg-gray-3 cursor-not-allowed'
  const singleClasses = 'form-select'
  const multipleClasses = 'form-multiselect'

  const hasValidation = () => valid !== undefined && valid !== null
  const validationStyle = () => {
    if (hasValidation()) {
      return valid ? activeClasses : invalidClasses
    }
  }

  const selectClasses = classNames(
    [
      'select-container w-full border rounded-md p-2 pl-4 pr-6 shadow',
      'focus:outline-gray-4',
    ],
    {
      'bg-white': !disabled,
    },
    // don't apply activeStyle if has valid or disabled
    !hasValidation() && !disabled && activeClasses,
    // don't apply disabledStyle if has valid
    !hasValidation() && disabled && disabledClasses,
    validationStyle(),
    !multiple && singleClasses,
    multiple && multipleClasses
  )

  const wrapperClasses = classNames(['relative', 'inline-block'], className)

  const getOptionLabelFromChildren = () => {
    const child = React.Children.toArray(children)
      .filter(
        (child) =>
          typeof child === 'object' &&
          React.isValidElement(child) &&
          child.type === 'option'
      )
      .find(
        (child) =>
          typeof child === 'object' &&
          React.isValidElement(child) &&
          child.props.value === value
      ) as React.ReactElement<
      { children?: string },
      string | React.JSXElementConstructor<any>
    >
    return children ? child?.props?.children || '' : null
  }
  return (
    <div className={wrapperClasses}>
      {!multiple && !props['aria-readonly'] ? (
        <button
          className={classNames(
            'z-10 absolute right-1 inline-block h-full w-8 pointer-events-none px-1',
            {
              'bg-white': !disabled,
            }
          )}
          style={{
            height: '90%',
            top: '5%',
            ...(disabled ? { backgroundColor: '#EDEEF1' } : {}),
          }}
        >
          {!disabled ? (
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="#1118276b">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : null}
        </button>
      ) : null}
      {props['aria-readonly'] ? (
        <TextInput
          value={
            getOptionLabelFromChildren() ||
            (options &&
              options.find((option) => option.value === value)?.label) ||
            ''
          }
          disabled={disabled}
          aria-readonly={props['aria-readonly']}
        />
      ) : (
        <select
          className={selectClasses}
          ref={ref}
          disabled={disabled}
          multiple={!!multiple}
          value={typeof value === 'string' ? value : ''}
          onChange={(e) => onChange(e)}
          {...props}
        >
          {options
            ? options.map(({ value, label, disabled }, i) => (
                <option key={`${value}-${i}`} value={value} disabled={disabled}>
                  {label}
                </option>
              ))
            : children}
        </select>
      )}
    </div>
  )
}

const ForwardedRefSelect = React.forwardRef(Select)

setDefaultProps(ForwardedRefSelect, {})

export default ForwardedRefSelect

export { ForwardedRefSelect as Select }
