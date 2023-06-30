import {useEffect, useRef, useState} from 'react'
import {useLoaderData, useRevalidator} from 'react-router-dom'

import MessageForm from '../components/MessageForm'
import MessageList from '../components/MessageList'
import echo from '../utils/echo'
import ky from '../utils/ky'

export async function action({params, request}) {
  const formData = await request.formData()

  await ky
    .post('messages', {
      json: {
        message: formData.get('message'),
        room_id: params.roomId,
      },
    })
    .json()

  return {}
}

export async function loader({params}) {
  const messages = await ky.get(`messages/${params.roomId}`).json()

  return {
    messages,
  }
}

export default function Room() {
  const formRef = useRef(null)
  const listRef = useRef(null)
  const {messages} = useLoaderData()
  const revalidator = useRevalidator()
  const [unreadMessages, setUnreadMessages] = useState(0)
  const [reachedBottom, setReachedBottom] = useState(false)

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
    setReachedBottom(true)
    setUnreadMessages(0)
  }

  useEffect(() => {
    const listener = echo
      .channel('messages')
      .listen('MessageCreated', revalidator.revalidate)

    formRef.current.reset()

    const listContainer = listRef.current
    if (listContainer) {
      const isScrollBottom =
        listContainer.scrollHeight - listContainer.clientHeight <=
        listContainer.scrollTop
      setReachedBottom(isScrollBottom)
    }

    const unreadMess = messages.filter((message) => !message.read_at && !reachedBottom).length
    setUnreadMessages(unreadMess)

    return () => listener.stopListening('MessageCreated')
  }, [revalidator, messages, reachedBottom])

  useEffect(() => {
    if (reachedBottom) {
      setUnreadMessages(0)
    }
  }, [reachedBottom])

  useEffect(() => {
    if (reachedBottom && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="flex flex-1 flex-col overflow-hidden p-4">
      <MessageList
        messages={messages}
        ref={listRef}
        key={messages.map((message) => message.id).join(',')}
      />
      {unreadMessages > 0 && !reachedBottom && (
        <div className="flex h-12 w-full items-center justify-center text-red-500">
          {unreadMessages} unread messages{' '}
          {!reachedBottom && <button onClick={scrollToBottom}>↓</button>}
        </div>
      )}
      <MessageForm ref={formRef} />
    </div>
  )
}
