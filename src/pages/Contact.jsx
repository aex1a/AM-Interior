import { useState } from 'react'
import Navigation from '../components/Navigation.jsx'
import Footer from '../components/Footer.jsx'
import styles from './Contact.module.css'
import { withBase } from '../utils/assetPath.js'


const SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbydJ0Cb-ImecVdVZEKP19sTKMZ_f_c4YH04tZh_g8uxWGSjc2j1w7Ntc_RhseWmWZHTpw/exec'

const invalidMessages = {
  first_name: 'First Name is required.',
  last_name: 'Last Name is required.',
  contact: 'Please enter a valid phone number (7-15 digits only).',
  email: 'Please enter a valid email address.',
  message: 'Message cannot be empty.',
}

function handleInvalid(fieldName) {
  return (e) => {
    e.target.setCustomValidity(invalidMessages[fieldName] || '')
  }
}

function clearValidity(e) {
  e.target.setCustomValidity('')
}

export default function Contact() {
  const [status, setStatus] = useState({ text: '', type: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target

    setStatus({ text: '', type: '' })
    setSubmitting(true)

    const formData = new FormData(form)

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData,
        mode: 'no-cors',
      })

      setStatus({ text: 'Your Message has been sent! Thank you for contacting us.', type: 'success' })
      form.reset()
    } catch (err) {
      console.error(err)
      setStatus({ text: 'Something went wrong. Please try again.', type: 'error' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <Navigation />

      <main className={styles.mainContent}>
        <section className={styles.contactSection}>
          <div className={styles.contactFormContainer}>
            <h3 className={styles.contactTitle}>CONTACT ANGELINE MERWIN INTERIORS</h3>
            <p className={styles.contactSubtitle}>
              It would be an honor to take part in making your vision into a reality
            </p>

            <p className={styles.contactNote}>
              Please use the contact form to send an inquiry or email me at{' '}
              <strong>qamerwinyin@gmail.com</strong>. We'll get back to you within 48 hours.
            </p>

            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.inputGroup}>
                  <input
                    className={styles.inputField}
                    type="text"
                    name="first_name"
                    placeholder="First Name (required)"
                    required
                    onInvalid={handleInvalid('first_name')}
                    onInput={clearValidity}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <input
                    className={styles.inputField}
                    type="text"
                    name="last_name"
                    placeholder="Last Name (required)"
                    required
                    onInvalid={handleInvalid('last_name')}
                    onInput={clearValidity}
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <input
                  className={styles.inputField}
                  type="text"
                  name="contact"
                  placeholder="Contact Number (required)"
                  pattern="[0-9]{7,15}"
                  required
                  onInvalid={handleInvalid('contact')}
                  onInput={clearValidity}
                />
              </div>

              <div className={styles.inputGroup}>
                <input
                  className={styles.inputField}
                  type="email"
                  name="email"
                  placeholder="Email (required)"
                  required
                  onInvalid={handleInvalid('email')}
                  onInput={clearValidity}
                />
              </div>

              <div className={styles.inputGroup}>
                <textarea
                  className={styles.inputField}
                  name="message"
                  rows="5"
                  placeholder="Message (required)"
                  required
                  onInvalid={handleInvalid('message')}
                  onInput={clearValidity}
                ></textarea>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={submitting}>
                {submitting ? 'SENDING...' : 'SUBMIT INQUIRY'}
              </button>

              <div className={`${styles.status} ${status.type ? styles[status.type] : ''}`}>
                {status.text}
              </div>
            </form>

            <p className={styles.privacyText}>
              We respect your privacy and will not divulge any personal information. You can opt
              out any time by sending me an email.
            </p>
          </div>

          <div className={styles.contactImageContainer}>
            <img src={withBase("/assets/images/contactimg.png")} alt="Counter" />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
