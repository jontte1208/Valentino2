import type { StructureResolver } from 'sanity/structure'

const MENU_CATEGORIES = [
  'Förrätter',
  'Plankor',
  'Sallader',
  'Varmrätter',
  'Kebab',
  'Bakpotatis',
  'Pasta',
  'Pizzor',
  'Special Pizzor',
  'Vegetariska Pizzor',
  'Kycklingpizzor',
  'Oxfilé Pizzor',
  'Kebabpizzor',
  'Mexikanska Pizzor',
  'Inbakade Pizzor',
  'Barn Meny',
  'Drycker',
]

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
      S.listItem()
        .title('Meny')
        .child(
          S.list()
            .title('Meny per kategori')
            .items([
              ...MENU_CATEGORIES.map((category) =>
                S.listItem()
                  .title(category)
                  .schemaType('menuItem')
                  .child(
                    S.documentTypeList('menuItem')
                      .title(category)
                      .filter('_type == "menuItem" && category == $category')
                      .params({ category })
                      .defaultOrdering([{ field: 'order', direction: 'asc' }])
                  )
              ),
              S.divider(),
              S.listItem()
                .title('Alla rätter (platt lista)')
                .schemaType('menuItem')
                .child(
                  S.documentTypeList('menuItem')
                    .title('Alla menyrätter')
                    .defaultOrdering([
                      { field: 'category', direction: 'asc' },
                      { field: 'order', direction: 'asc' },
                    ])
                ),
            ])
        ),
      S.documentTypeListItem('galleryImage').title('Galleri'),
    ])
