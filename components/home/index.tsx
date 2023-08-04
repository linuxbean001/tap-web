import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useRole } from '../../lib/contexts'
import { Spinner } from '../spinner'

export function Home() {
  const { isMember, role } = useRole()
  const router = useRouter()
  useEffect(() => {
    if (typeof role === 'undefined') {
      return
    }
    isMember()
      ? router.push({ pathname: '/courses' })
      : router.push({ pathname: '/dashboard' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role])
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <Spinner size={16} borderColor={'#0069E4'} />
    </div>
  )
}
