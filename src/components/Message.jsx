import clsx from 'clsx'

import {useUser} from '../context/auth.context'

const userColors = ['blue', 'green', 'red', 'purple', 'orange']

export default function Message({message}) {
  const user = useUser()
  const isAuthUser = message.sender.id === user.id
  const senderColor = isAuthUser ? 'primary' : getUserColor(message.sender.id)

  function getUserColor(userId) {
    const index = userId % userColors.length
    return userColors[index]
  }

  return (
    <div
      className={clsx('flex items-end space-x-2', {
        'self-end': isAuthUser,
      })}
    >
      {!isAuthUser && (
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-full bg-${senderColor}-100`}
        >
          {message.sender.name[0]}
        </div>
      )}
      <div
        className={clsx('rounded-md p-4', {
          'rounded-bl-none': !isAuthUser,
          'rounded-br-none': isAuthUser,
          [`bg-${senderColor}-100`]: !isAuthUser,
          [`bg-${senderColor}-200`]: isAuthUser,
        })}
      >
        {message.message}
      </div>
    </div>
  )
}
