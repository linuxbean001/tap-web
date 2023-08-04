import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="flex w-full py-8 px-4 text-blue-gray font-body text-md md:text-sm font-regular underline-offset-2 justify-center">
      <div className="max-w-7xl w-full sm:px-6 lg:px-8">
        <hr className="border-t mb-4 border-gray-2" />
        <div className="flex">
          <div className="flex w-1/12 border-r border-primary-1 p-2 items-center justify-center">
            <Image
              className="w-8 h-8"
              width={32}
              height={32}
              src="/tap_reskin.svg"
              alt="Tap3d"
            />
          </div>
          <div className="flex w-full md:w-5/12 lg:w-2/3 items-center justify-center">
            <div className="block w-full text-left px-4">
              Copyright {new Date().getFullYear()} TAP - Training All People
            </div>
          </div>
          <div className="hidden md:flex w-full md:w-1/2 lg:w-1/3 items-center justify-center">
            <div className="block w-full text-right px-4">
              {/* <div className="inline-block w-1/3 py-2">
                <a href="#" className="underline">
                  Privacy Policy
                </a>
              </div>
              <div className="inline-block w-1/3 py-2">
                <a href="#" className="underline">
                  Terms of Use
                </a>
              </div> */}
              <div className="inline-block w-1/3 py-2">
                <a href="mailto:support@tap3d.com" className="underline">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
