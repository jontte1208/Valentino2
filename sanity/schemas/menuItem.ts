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
          { title: 'Sallader', value: 'Sallader' },
          { title: 'Varmrätter', value: 'Varmrätter' },
          { title: 'Kebab', value: 'Kebab' },
          { title: 'Bakpotatis', value: 'Bakpotatis' },
          { title: 'Pasta', value: 'Pasta' },
          { title: 'Pizzor', value: 'Pizzor' },
          { title: 'Special Pizzor', value: 'Special Pizzor' },
          { title: 'Vegetariska Pizzor', value: 'Vegetariska Pizzor' },
          { title: 'Kycklingpizzor', value: 'Kycklingpizzor' },
          { title: 'Oxfilé Pizzor', value: 'Oxfilé Pizzor' },
          { title: 'Kebabpizzor', value: 'Kebabpizzor' },
          { title: 'Mexikanska Pizzor', value: 'Mexikanska Pizzor' },
          { title: 'Inbakade Pizzor', value: 'Inbakade Pizzor' },
          { title: 'Barn Meny', value: 'Barn Meny' },
          { title: 'Drycker', value: 'Drycker' },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'pizzaType',
      title: 'Pizza-typ (visas bara för pizza-kategorier)',
      type: 'string',
      hidden: ({ document }) =>
        !(typeof document?.category === 'string' && document.category.includes('Pizz')),
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
