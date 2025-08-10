import { getTranslations } from "next-intl/server"
import { Cormorant_Garamond } from "next/font/google"
import {
  FaCertificate,
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaMapMarkerAlt,
  FaPhone,
  FaShieldAlt,
  FaUsers,
  FaWhatsapp
} from "react-icons/fa"

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
})

export default async function ContactPage() {
  const t = await getTranslations("contact")

  return (
    <>
      {/* Hero Section */}
      <section className='relative bg-gradient-to-br from-[#1f221b] via-[#2e4e1f] to-[#1f221b] text-white py-20'>
        <div className='absolute inset-0 bg-black/20' />
        <div className='relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center'>
          <h1
            className={`${cormorant.className} text-5x mt-10 md:text-6xl font-bold mb-6`}>
            {t("hero.title")}
          </h1>
          <p
            className={`${cormorant.className} text-sm md:text-2xl text-[#e7c6c2] max-w-3xl mx-auto leading-relaxed`}>
            {t("hero.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
          {/* Contact Form */}
          <div className='space-y-8'>
            <div>
              <h2
                className={`${cormorant.className} text-3xl font-semibold text-[#1f221b] mb-4`}>
                {t("form.title")}
              </h2>
              <p className='text-[#1f221b]/80 leading-relaxed'>
                {t("form.description")}
              </p>
            </div>

            <form className='space-y-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label
                    htmlFor='firstName'
                    className='block text-sm font-medium text-[#1f221b] mb-2'>
                    {t("form.firstName")}
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    required
                    className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'
                    placeholder={t("form.firstNamePlaceholder")}
                  />
                </div>
                <div>
                  <label
                    htmlFor='lastName'
                    className='block text-sm font-medium text-[#1f221b] mb-2'>
                    {t("form.lastName")}
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    required
                    className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'
                    placeholder={t("form.lastNamePlaceholder")}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.email")}
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  required
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'
                  placeholder={t("form.emailPlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.phone")}
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'
                  placeholder={t("form.phonePlaceholder")}
                />
              </div>

              <div>
                <label
                  htmlFor='tripType'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.tripType")}
                </label>
                <select
                  id='tripType'
                  name='tripType'
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'>
                  <option value=''>{t("form.tripTypePlaceholder")}</option>
                  <option value='serengeti'>
                    {t("form.tripTypes.serengeti")}
                  </option>
                  <option value='ngorongoro'>
                    {t("form.tripTypes.ngorongoro")}
                  </option>
                  <option value='migration'>
                    {t("form.tripTypes.migration")}
                  </option>
                  <option value='tarangire'>
                    {t("form.tripTypes.tarangire")}
                  </option>
                  <option value='zanzibar'>
                    {t("form.tripTypes.zanzibar")}
                  </option>
                  <option value='custom'>{t("form.tripTypes.custom")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='travelers'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.travelers")}
                </label>
                <select
                  id='travelers'
                  name='travelers'
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'>
                  <option value=''>{t("form.travelersPlaceholder")}</option>
                  <option value='1'>1 {t("form.traveler")}</option>
                  <option value='2'>2 {t("form.travelers")}</option>
                  <option value='3'>3 {t("form.travelers")}</option>
                  <option value='4'>4 {t("form.travelers")}</option>
                  <option value='5+'>5+ {t("form.travelers")}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='budget'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.budget")}
                </label>
                <select
                  id='budget'
                  name='budget'
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all'>
                  <option value=''>{t("form.budgetPlaceholder")}</option>
                  <option value='budget'>{t("form.budgets.budget")}</option>
                  <option value='midrange'>{t("form.budgets.midrange")}</option>
                  <option value='luxury'>{t("form.budgets.luxury")}</option>
                  <option value='ultra-luxury'>
                    {t("form.budgets.ultraLuxury")}
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor='message'
                  className='block text-sm font-medium text-[#1f221b] mb-2'>
                  {t("form.message")}
                </label>
                <textarea
                  id='message'
                  name='message'
                  rows={5}
                  className='w-full px-4 py-3 border border-[#c6b892]/30 rounded-lg bg-white/50 focus:ring-2 focus:ring-[#c6b892] focus:border-transparent transition-all resize-none'
                  placeholder={t("form.messagePlaceholder")}
                />
              </div>

              <button
                type='submit'
                className={`w-full bg-[#2e4e1f] text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-[#1f221b] transition-all duration-300 transform hover:scale-[1.02] ${cormorant.className}`}>
                {t("form.submit")}
              </button>
            </form>
          </div>

          {/* Contact Information & Trust Signals */}
          <div className='space-y-8'>
            {/* Direct Contact */}
            <div className='bg-gradient-to-br from-[#f6f3ee] to-[#e7c6c2]/30 p-8 rounded-2xl border border-[#c6b892]/20'>
              <h3
                className={`${cormorant.className} text-2xl font-semibold text-[#1f221b] mb-6`}>
                {t("directContact.title")}
              </h3>

              <div className='space-y-4'>
                <a
                  href='https://wa.me/255000000'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-4 p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all group'>
                  <FaWhatsapp className='text-2xl' />
                  <div>
                    <div className='font-semibold'>
                      {t("directContact.whatsapp")}
                    </div>
                    <div className='text-sm opacity-90'>+255 000 000</div>
                  </div>
                </a>

                <a
                  href='tel:+255000000'
                  className='flex items-center gap-4 p-4 bg-[#2e4e1f] text-white rounded-lg hover:bg-[#1f221b] transition-all group'>
                  <FaPhone className='text-xl' />
                  <div>
                    <div className='font-semibold'>
                      {t("directContact.phone")}
                    </div>
                    <div className='text-sm opacity-90'>+255 000 000</div>
                  </div>
                </a>

                <a
                  href='mailto:info@bigfivetrails.com'
                  className='flex items-center gap-4 p-4 bg-[#c6b892] text-[#1f221b] rounded-lg hover:bg-[#b8a97a] transition-all group'>
                  <FaEnvelope className='text-xl' />
                  <div>
                    <div className='font-semibold'>
                      {t("directContact.email")}
                    </div>
                    <div className='text-sm opacity-90'>
                      info@bigfivetrails.com
                    </div>
                  </div>
                </a>
              </div>
            </div>

            {/* Office Information */}
            <div className='bg-white p-8 rounded-2xl border border-[#c6b892]/20 shadow-sm'>
              <h3
                className={`${cormorant.className} text-2xl font-semibold text-[#1f221b] mb-6`}>
                {t("office.title")}
              </h3>

              <div className='space-y-4'>
                <div className='flex items-start gap-4'>
                  <FaMapMarkerAlt className='text-[#2e4e1f] text-xl mt-1' />
                  <div>
                    <div className='font-semibold text-[#1f221b]'>
                      {t("office.address.title")}
                    </div>
                    <div className='text-[#1f221b]/80 text-sm leading-relaxed'>
                      {t("office.address.street")}
                      <br />
                      {t("office.address.city")}
                      <br />
                      {t("office.address.country")}
                    </div>
                  </div>
                </div>

                <div className='flex items-center gap-4'>
                  <FaClock className='text-[#2e4e1f] text-xl' />
                  <div>
                    <div className='font-semibold text-[#1f221b]'>
                      {t("office.hours.title")}
                    </div>
                    <div className='text-[#1f221b]/80 text-sm'>
                      {t("office.hours.schedule")}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust & Security */}
            <div className='bg-gradient-to-br from-[#1f221b] to-[#2e4e1f] text-white p-8 rounded-2xl'>
              <h3
                className={`${cormorant.className} text-2xl font-semibold mb-6`}>
                {t("trust.title")}
              </h3>

              <div className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <FaShieldAlt className='text-[#c6b892] text-xl' />
                  <span className='text-sm'>{t("trust.licensed")}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FaCertificate className='text-[#c6b892] text-xl' />
                  <span className='text-sm'>{t("trust.certified")}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FaUsers className='text-[#c6b892] text-xl' />
                  <span className='text-sm'>{t("trust.experienced")}</span>
                </div>
                <div className='flex items-center gap-3'>
                  <FaGlobe className='text-[#c6b892] text-xl' />
                  <span className='text-sm'>{t("trust.local")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAQ Section */}
      <section className='bg-[#f6f3ee] py-16'>
        <div className='mx-auto max-w-4xl px-4 sm:px-6 lg:px-8'>
          <h2
            className={`${cormorant.className} text-3xl font-semibold text-[#1f221b] text-center mb-12`}>
            {t("faq.title")}
          </h2>

          <div className='space-y-6'>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className='bg-white p-6 rounded-lg border border-[#c6b892]/20'>
                <h3
                  className={`${cormorant.className} text-xl font-semibold text-[#1f221b] mb-3`}>
                  {t(`faq.q${i}.question`)}
                </h3>
                <p className='text-[#1f221b]/80 leading-relaxed'>
                  {t(`faq.q${i}.answer`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
