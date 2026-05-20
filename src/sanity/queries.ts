import { groq } from 'next-sanity'

export const menuItemsQuery = groq`
  *[_type == "menuItem"] | order(category asc, order asc) {
    _id,
    name,
    description,
    price,
    category,
    pizzaType,
    order
  }
`

export const lunchWeekQuery = groq`
  *[_type == "lunchWeek" && weekNumber == $weekNumber && year == $year][0] {
    weekNumber,
    year,
    days[]{
      dayOfWeek,
      dishName,
      description,
      price
    },
    soup{
      name,
      description,
      price
    }
  }
`

export const galleryImagesQuery = groq`
  *[_type == "galleryImage"] | order(order asc) {
    _id,
    image,
    alt,
    order
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    heroTitle,
    heroSubtitle,
    heroImage,
    aboutTitle,
    aboutText,
    aboutStory,
    aboutBody,
    aboutImage,
    openingHours,
    lunchHours,
    address,
    phone,
    email,
    mapEmbedUrl,
    facebookUrl,
    instagramUrl
  }
`
