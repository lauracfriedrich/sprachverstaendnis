import { register } from 'register-service-worker'

if (process.env.NODE_ENV === 'production') {
  register(`${process.env.BASE_URL}service-worker.js`, {
    ready() {
      console.log('Die Studie ist offline verfügbar.')
    },
    registered() {
      console.log('Service Worker wurde registriert.')
    },
    cached() {
      console.log('Alle Dateien wurden für die Offline-Nutzung gespeichert.')
    },
    error(error) {
      console.error('Fehler beim Service Worker:', error)
    }
  })
}