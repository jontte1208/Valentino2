import { defineField, defineType, defineArrayMember } from 'sanity'

const DAYS = ['Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag']

export const lunchWeek = defineType({
  name: 'lunchWeek',
  title: 'Veckans lunch',
  type: 'document',
  fields: [
    defineField({
      name: 'weekNumber',
      title: 'Veckonummer (ISO)',
      type: 'number',
      validation: (r) => r.required().min(1).max(53),
    }),
    defineField({
      name: 'year',
      title: 'År',
      type: 'number',
      validation: (r) => r.required().min(2024).max(2100),
    }),
    defineField({
      name: 'days',
      title: 'Dagar',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'lunchDay',
          fields: [
            defineField({
              name: 'dayOfWeek',
              title: 'Dag',
              type: 'string',
              options: { list: DAYS.map((d) => ({ title: d, value: d })) },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'dishName',
              title: 'Rätt',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'description',
              title: 'Beskrivning',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'price',
              title: 'Pris (kr)',
              type: 'number',
              validation: (r) => r.required().min(0),
            }),
          ],
          preview: {
            select: { title: 'dishName', subtitle: 'dayOfWeek', price: 'price' },
            prepare({ title, subtitle, price }) {
              return { title: `${subtitle}: ${title}`, subtitle: `${price} kr` }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'soup',
      title: 'Veckans soppa',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Namn', type: 'string' }),
        defineField({ name: 'description', title: 'Beskrivning', type: 'text', rows: 2 }),
        defineField({ name: 'price', title: 'Pris (kr)', type: 'number' }),
      ],
    }),
  ],
  preview: {
    select: { week: 'weekNumber', year: 'year' },
    prepare({ week, year }) {
      return { title: `Vecka ${week}`, subtitle: `${year}` }
    },
  },
  orderings: [
    {
      title: 'År och vecka (nyast först)',
      name: 'weekDesc',
      by: [
        { field: 'year', direction: 'desc' },
        { field: 'weekNumber', direction: 'desc' },
      ],
    },
  ],
})
