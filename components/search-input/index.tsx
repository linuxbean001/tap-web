import React, { useState } from 'react'
import { setDefaultProps } from '../../lib/utils'
import TextInput from '../text-input'
import { CancelIcon, SearchIcon } from './components'

type SearchInputProps = {
  type?: never
} & import('../text-input').TextInputProps

function SearchInput(
  { onChange, ...props }: SearchInputProps,
  ref: React.ForwardedRef<HTMLInputElement>
) {
  if (!ref) {
    ref = React.createRef()
  }
  const [hasText, setHasText] = useState(false)
  return (
    <div className="relative">
      <span className="absolute top-0 left-2 h-full flex items-center justify-items-center">
        <SearchIcon size="16" />
      </span>
      <TextInput
        {...props}
        type="search"
        className="pl-8"
        ref={ref}
        onChange={(e) => {
          const elem = e.target as HTMLInputElement
          setHasText(!!elem.value.length)
          typeof onChange === 'function' && onChange(e)
        }}
      />
      {hasText ? (
        <span className="absolute top-0 right-2 h-full flex items-center justify-items-center">
          <button
            className="p-2"
            onClick={() => {
              if (ref && typeof ref !== 'function' && ref?.current) {
                ref.current.value = ''
                ref.current.dispatchEvent(
                  new Event('change', { bubbles: false })
                )
                ref.current.focus()
                setHasText(false)
              }
            }}
          >
            <CancelIcon size="16" />
          </button>
        </span>
      ) : null}
    </div>
  )
}

const ForwardedRefSearchInput = React.forwardRef(SearchInput)

setDefaultProps(ForwardedRefSearchInput, {})

export default ForwardedRefSearchInput

export { ForwardedRefSearchInput as SearchInput }
