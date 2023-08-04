import { Combobox } from '@headlessui/react'
import { CheckBadgeIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import React, { useMemo, useState } from 'react'
import { setDefaultProps } from '../../lib/utils'

type AutocompleteOption = {
  label: string
  value: string
  disabled?: boolean | undefined
}
type AutocompleteInputProps<
  TOptions extends readonly AutocompleteOption[],
  TValue extends PickPropAsUnion<TOptions, 'value'>
> = {
  value: TValue
  options: TOptions
  className?: any
  valid?: boolean
  disabled?: boolean
  onChange?: (value: string | string[] | null) => any
  multiple?: boolean
} & React.HTMLAttributes<HTMLInputElement>

function AutocompleteInput<
  TOptions extends readonly AutocompleteOption[],
  TValue extends PickPropAsUnion<TOptions, 'value'>
>(
  {
    children,
    className,
    options,
    value,
    valid,
    disabled,
    onChange,
    multiple,
    ...props
  }: AutocompleteInputProps<TOptions, TValue>,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  if (!ref) {
    ref = React.createRef()
  }
  const [isActive, setIsActive] = useState(false)
  const [selected, setSelected] = useState<
    AutocompleteOption | AutocompleteOption[] | null | undefined
  >(
    multiple
      ? options.filter((o) => o.value === value)
      : options.find((o) => o.value === value)
  )

  const buttonRef = useMemo(() => React.createRef<HTMLButtonElement>(), [])

  const activeClasses = classNames({
    'focus:border-primary-5': !props['aria-readonly'],
  })
  const invalidClasses = 'border-red-5 focus:border-red-5 hover:border-red-5'
  const disabledClasses = 'border-dark-tertiary bg-gray-3 cursor-not-allowed'

  const hasValidation = () => valid !== undefined && valid !== null
  const validationStyle = () => {
    if (hasValidation()) {
      return valid ? (isActive ? '' : activeClasses) : invalidClasses
    }
  }
  const inputClassName = classNames(
    [
      'border rounded-md p-2 placeholder-gray-5 shadow-sm w-full',
      'focus:outline-none',
    ],
    {
      'caret-primary-5': !props['aria-readonly'],
      'caret-transparent': props['aria-readonly'],
      'border-gray-3': !isActive && (!hasValidation() || valid),
      [activeClasses]:
        isActive && (hasValidation() ? valid : true) && !disabled,
      [disabledClasses]: !hasValidation() && disabled,
    },
    validationStyle()
  )

  const checkedIconRenderer = (
    selected: AutocompleteOption | AutocompleteOption[] | null | undefined,
    option: AutocompleteOption
  ) => {
    if (Array.isArray(selected)) {
      const found = selected.find((item) => item.value === option.value)

      return (
        found && (
          <span className="whitespace-nowrap">
            &nbsp;
            <CheckBadgeIcon
              width="16"
              height="16"
              className="inline relative bottom-1"
            />
          </span>
        )
      )
    }
    return (
      (selected as AutocompleteOption).value === option.value && (
        <span className="whitespace-nowrap">
          &nbsp;
          <CheckBadgeIcon
            width="16"
            height="16"
            className="inline relative bottom-1"
          />
        </span>
      )
    )
  }

  return (
    <Combobox
      as="div"
      className={classNames(
        className,
        'relative inline-block autocomplete-input'
      )}
      value={selected}
      onChange={(option: any) => {
        let dataToSet:
          | AutocompleteOption
          | AutocompleteOption[]
          | null
          | undefined

        if (Array.isArray(selected) && Array.isArray(option)) {
          const seen = new Set<string>()
          const hasDuplicates = option.some(function (currentObject) {
            return seen.size === seen.add(currentObject.value).size
          })
          if (hasDuplicates) {
            const seenArr = Array.from(seen)
            const newDataSet: AutocompleteOption[] = seenArr.reduce(
              (agg: AutocompleteOption[], cur) => {
                const filtederOption = option.filter((o) => o.value === cur)
                if (filtederOption.length > 1) {
                  return agg
                }
                agg.push(...filtederOption)
                return agg
              },
              []
            )
            dataToSet = newDataSet
          } else {
            dataToSet = option
          }
        } else {
          dataToSet = option
        }

        setSelected(dataToSet)

        if (typeof onChange === 'function') {
          const data = multiple
            ? (dataToSet as AutocompleteOption[]).map((item) => item.value)
            : (dataToSet as AutocompleteOption).value

          onChange(data)
        }
      }}
      // @ts-ignore
      multiple={multiple}
    >
      <>       

        <Combobox.Options
          className={classNames([
            'absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-md bg-white',
            'py-1 text-base shadow-lg focus:outline-none sm:text-sm border border-primary-5',
            'custom-scroller',
          ])}
        >
          {options.map((option) => {
            /* Use the `active` state to conditionally style the active option. */
            /* Use the `selected` state to conditionally style the selected option. */
            return (
              <Combobox.Option
                className={({ active }) =>
                  classNames(
                    'relative select-none py-2 pl-3 pr-9 cursor-pointer'
                  )
                }
                key={option.value}
                value={option}
                as="div"
              >
                {({ active }) => (
                  <li
                    className={classNames('bg-white', {
                      'font-bold': active,
                    })}
                  >
                    {option.label}
                    {checkedIconRenderer(selected, option)}
                  </li>
                )}
              </Combobox.Option>
            )
          })}
        </Combobox.Options>
      </>
    </Combobox>
  )
}

const ForwardedRefAutocompleteInput = React.forwardRef(AutocompleteInput)

setDefaultProps(ForwardedRefAutocompleteInput, {})

export default ForwardedRefAutocompleteInput

export { ForwardedRefAutocompleteInput as AutocompleteInput }

type PickPropAsUnion<
  TItems extends readonly { [key in TProp]: any }[],
  TProp extends string
> = TItems[number] extends { [key in TProp]: infer TValue } ? TValue : never
