import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Sidinnehåll',
  type: 'document',
  fields: [
    defineField({
      name: 'heroTitle',
      title: 'Hero — Titel',
      type: 'string',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'Hero — Underrubrik',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero — Bakgrundsbild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutTitle',
      title: 'Om oss — Titel',
      type: 'string',
    }),
    defineField({
      name: 'aboutText',
      title: 'Om oss — Stycke 1',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'aboutStory',
      title: 'Om oss — Stycke 2',
      type: 'text',
      rows: 5,
    }),
    defineField({
      name: 'aboutBody',
      title: 'Om oss — Rikt textinnehåll (valfri)',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'aboutImage',
      title: 'Om oss — Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'openingHours',
      title: 'Öppettider',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'hoursRow',
          fields: [
            defineField({ name: 'day', title: 'Dag', type: 'string' }),
            defineField({ name: 'hours', title: 'Tider', type: 'string' }),
          ],
          preview: {
            select: { title: 'day', subtitle: 'hours' },
          },
        },
      ],
    }),
    defineField({
      name: 'lunchHours',
      title: 'Lunchtider (kort textrad)',
      type: 'string',
    }),
    defineField({ name: 'address', title: 'Adress', type: 'string' }),
    defineField({ name: 'phone', title: 'Telefon', type: 'string' }),
    defineField({ name: 'email', title: 'E-post', type: 'string' }),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Google Maps embed-URL',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'Facebook-URL',
      type: 'url',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'Instagram-URL',
      type: 'url',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Sidinnehåll' }
    },
  },
})
