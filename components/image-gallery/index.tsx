import classNames from 'classnames'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'

type ImageGalleryProps = {
  images: (string | StaticImageData)[]
  className?: any
} & React.HTMLAttributes<HTMLDivElement>

function ImageGallery(
  { images, className, ...props }: ImageGalleryProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  const [image, setImage] = useState(images[0])
  const width = 1280,
    height = 640
  const getImageSource = (i: string | StaticImageData) =>
    typeof i === 'string' ? i : i.src
  const isActive = (i: string | StaticImageData) => {
    return getImageSource(i) === getImageSource(image)
  }

  return (
    <div
      {...props}
      className={classNames('grid grid-cols-1 gap-1', className)}
      ref={ref}
    >
      <div className="block h-64 w-full bg-gray-2 overflow-hidden relative">
        <Image
          key={getImageSource(image)}
          className={classNames('w-full absolute -top-1/2 left-0')}
          src={image}
          alt="Course Image"
          {...(typeof image === 'string' ? { width, height } : {})}
        ></Image>
      </div>
    </div>
  )
}

const ForwardedRefImageGallery = React.forwardRef(ImageGallery)

export default ForwardedRefImageGallery

export { ForwardedRefImageGallery as ImageGallery }
