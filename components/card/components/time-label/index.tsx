import classNames from 'classnames/dedupe'
import { DateTime } from 'luxon'

type TimeLabelProps = {
  className?: any
} & (
  | { date: string | Date; text?: string }
  | { date?: string | Date; text: string }
)

export function TimeLabel({ date, text, className }: TimeLabelProps) {
  return (
    <span
      className={classNames(
        className,
        'flex items-center justify-items-center text-dark-tertiary text-sm'
      )}
    >
      <span>
        <svg
          className="inline mr-2"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.75 3.5C8.75 3.08579 8.41421 2.75 8 2.75C7.58579 2.75 7.25 3.08579 7.25 3.5H8.75ZM8 8H7.25C7.25 8.41421 7.58579 8.75 8 8.75V8ZM11.375 8.75C11.7892 8.75 12.125 8.41421 12.125 8C12.125 7.58579 11.7892 7.25 11.375 7.25V8.75ZM14 8C14 11.3137 11.3137 14 8 14V15.5C12.1421 15.5 15.5 12.1421 15.5 8H14ZM8 14C4.68629 14 2 11.3137 2 8H0.5C0.5 12.1421 3.85786 15.5 8 15.5V14ZM2 8C2 4.68629 4.68629 2 8 2V0.5C3.85786 0.5 0.5 3.85786 0.5 8H2ZM8 2C11.3137 2 14 4.68629 14 8H15.5C15.5 3.85786 12.1421 0.5 8 0.5V2ZM7.25 3.5V8H8.75V3.5H7.25ZM11.375 7.25H8V8.75H11.375V7.25Z"
            fill="#111827"
            fillOpacity="0.42"
          />
        </svg>
      </span>
      {date
        ? DateTime.fromISO(
            typeof date === 'string' ? date : date.toISOString()
          ).toRelative()
        : text}
    </span>
  )
}

TimeLabel.defaultProps = {}

export default TimeLabel
