const ShoppingListService = require ('../src/shopping-list-service')
const knex = require('knex')

describe(` service object`, function() {
     let db

        let testItems = [
             {
                id: 1,
                name: 'mayen',
                price: 10.99,
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                category: 'Main',
                checked: false
            
             },
             {
                id: 2,
                name: 'david',
                price: 11.99,
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                category: 'Lunch',
                checked: true
             },
             {
                id: 3,
                name: 'dennis',
                price: 20.99,
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                category: 'Snack',
                checked: false
             },
           ]
           
        
   before(() => {
    db = knex({
      client: 'pg',
       connection: process.env.TEST_DB_URL,
     })
  })

  before(() => db('shopping_list').truncate())

  afterEach(() => db('shopping_list').truncate())
  
  after(() => db.destroy())

    
     
     context(`Given 'shopping_list' has data`, () => {
        beforeEach(() => {
          return db
            .into('shopping_list')
            .insert(testItems)
        })

        it.only(`getById() resolves an shoppingList by id from 'shopping_list' table`, () => {
            const thirdId = 3
            const thirdTestItem = testItems[thirdId - 1]
            return ShoppingListService.getById(db, thirdId)
              .then(actual => {
                expect(actual).to.eql({
                    id: 3,
                    name: 'paul',
                    price: 20.99,
                    date_added: new Date('2029-01-22T16:28:32.615Z'),
                    category: 'Snack',
                    checked: false 
                })
              })
          })

             it(`deleteArticle() removes an article by id from 'shopping_list' table`, () => {
                 const itemId = 3
                 return ShoppingListService .deleteItem(db, itemId)
                   .then(() => ShoppingListService .getAllItems(db))
                   .then(allItems => {
                     // copy the test articles array without the "deleted" article
                     const expected = testItems.filter(item=> item.id !== itemId)
                     expect(allItems).to.eql(expected)
                   })
               })

        
                  it(`updateArticle() updates an article from the 'blogful_articles' table`, () => {
                     const idOfArticleToUpdate = 3
                     const newArticleData = {
                       title: 'updated title',
                       content: 'updated content',
                       date_published: new Date(),
                     }
                 return ShoppingListService .updateArticle(db, idOfArticleToUpdate, newArticleData)
                       .then(() => ShoppingListService .getById(db, idOfArticleToUpdate))
                       .then(article => {
                         expect(article).to.eql({
                           id: idOfArticleToUpdate,
                           ...newArticleData,
                         })
                       })
                   })
    
        it(`getAllArticles() resolves all articles from 'blogful_articles' table`, () => {
          return ArticlesService.getAllArticles(db)
            .then(actual => {
              expect(actual).to.eql(testArticles)
            })
        })
      })
    
     context(`Given 'blogful_articles' has no data`, () => {
       it(`getAllArticles() resolves an empty array`, () => {
         return ArticlesService.getAllArticles(db)
           .then(actual => {
             expect(actual).to.eql([])
           })
       })

       it(`insertArticle() inserts an article and resolves the article with an 'id'`, () => {
          const newArticle = {
            title: 'Test new title',
            content: 'Test new content',
            date_published: new Date('2020-01-01T00:00:00.000Z'),
          }
          return ArticlesService.insertArticle(db, newArticle)
          .then(actual => {
                  expect(actual).to.eql({
                   id: 1,
                    title: newArticle.title,
                    content: newArticle.content,
                    date_published: new Date(newArticle.date_published),
                  })
                })
         })

        
     })

  })
