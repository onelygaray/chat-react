import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

window.Pusher = Pusher

export default new Echo({
  broadcaster: 'pusher',
  key: '664fb35314a934b5f0a3',
  cluster: 'us2',
  forceTLS: true,
})
