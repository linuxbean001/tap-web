import Image from 'next/image'

export const NoChartData = () => (
  <div className="bg-gray-1 h-[26rem] flex flex-col justify-center items-center">
    <Image
      src={'/images/stars-rectangle.svg'}
      width="41"
      height="58"
      alt="no data image"
    />
    <p className="text-md font-bold text-dark-secondary mt-6">
      Understand Your Workforce’s Skill Level
    </p>
    <p className="text-sm font-regular text-dark-secondary">
      Select a topic from the dropdown to view skill distribution by topic
    </p>
  </div>
)
