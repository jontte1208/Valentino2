import { defineField, defineType } from 'sanity'

export const menuItem = defineType({
  name: 'menuItem',
  title: 'Menyrätt',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Namn',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivning',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'Pris (kr)',
      type: 'number',
      validation: (r) => r.required().min(0),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Förrätter', value: 'Förrätter' },
          { title: 'Plankor', value: 'Plankor' },
          { title: 'Pizza', value: 'Pizza' },
          { title: 'Pasta', value: 'Pasta' },
          { title: 'Sallader', value: 'Sallader' },
          { title: 'Kött & Fisk', value: 'Kött & Fisk' },
          { title: 'Barnmeny', value: 'Barnmeny' },
          { title: 'Dessert', value: 'Dessert' },
          { title: 'Dryck', value: 'Dryck' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pizzaType',
      title: 'Pizza-typ (om Pizza)',
      type: 'string',
      hidden: ({ document }) => document?.category !== 'Pizza',
    }),
    defineField({
      name: 'order',
      title: 'Ordning inom kategori',
      type: 'number',
      initialValue: 0,
    }),
  ],
  orderings: [
    {
      title: 'Kategori, sedan ordning',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'order', direction: 'asc' },
      ],
    },
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', price: 'price' },
    prepare({ title, subtitle, price }) {
      return { title, subtitle: `${subtitle} — ${price} kr` }
    },
  },
})
