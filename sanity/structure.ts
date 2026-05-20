import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Innehåll')
    .items([
      S.listItem()
        .title('Sidinnehåll')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
            .title('Sidinnehåll')
        ),
      S.divider(),
      S.documentTypeListItem('lunchWeek').title('Veckans lunch'),
      S.documentTypeListItem('menuItem').title('Meny'),
      S.documentTypeListItem('galleryImage').title('Galleri'),
    ])
