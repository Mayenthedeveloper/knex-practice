const ShoppingListService = require ('../src/shopping-list-service')
const knex = require('knex')

describe(` Shopping List service object`, function() {
     let db

        let testItems = [
             {
                id: 1,
                name: 'mayen',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                price: '10.99',
                category: 'Main',
                checked: false
            
             },
             {
                id: 2,
                name: 'david',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                price: '11.99',
                category: 'Lunch',
                checked: true
             },
             {
                id: 3,
                name: 'dennis',
                date_added: new Date('2029-01-22T16:28:32.615Z'),
                price: '20.99',
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

        it(`getById() resolves an item by id from 'shopping_list' table`, () => {
            const idToGet = 3
            const thirdItem = testItems[idToGet- 1]
            return ShoppingListService.getById(db, idToGet)
              .then(actual => {
                expect(actual).to.eql({
                    id: idToGet,
                    name: thirdItem.name,
                    date_added: thirdItem.date_added,
                    price: thirdItem.price,
                    category: thirdItem.category,
                    checked: false,
                })
              })
          })

             it(`deleteItem() removes an article by id from 'shopping_list' table`, () => {
                 const itemId = 3
                 return ShoppingListService .deleteItem(db, itemId)
                   .then(() => ShoppingListService .getAllItems(db))
                   .then(allItems => {
                     // copy the test articles array without the "deleted" article
                     const expected = testItems.filter(item=> item.id !== itemId)
                     expect(allItems).to.eql(expected)
                   })
               })

        
               it(`updateItem() updates an item in the 'shopping_list' table`, () => {
                const idOfItemToUpdate = 3;
                const newItemData = {
                  name: 'updated title',
                  price: '99.99',
                  date_added: new Date(),
                  checked: true,
                };

                const originalItem = testItems[idOfItemToUpdate - 1];
                return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
                .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
                .then(item => {
                  expect(item).to.eql({
                    id: idOfItemToUpdate,
                    ...originalItem,
                    ...newItemData,
                         })
                       })
                   })
    
        it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
          return ShoppingListService.getAllItems(db)
            .then(actual => {
              expect(actual).to.eql(testItems)
            })
        })
      })
    
      context(`Given 'shopping_list' has no data`, () => {
        it(`getAllItems() resolves an empty array`, () => {
          return ShoppingListService.getAllItems(db)
            .then(actual => {
              expect(actual).to.eql([]);
           })
       })

       it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
        const newItem = {
          name: 'Test new name name',
          price: '5.05',
          date_added: new Date('2020-01-01T00:00:00.000Z'),
          checked: true,
          category: 'Lunch',
          }
          return ShoppingListService.insertItem(db, newItem)
            .then(actual => {
            expect(actual).to.eql({
                id: 1,
                name: newItem.name,
                price: newItem.price,
                date_added: newItem.date_added,
                checked: newItem.checked,
                category: newItem.category,
                  })
                })
         })

        
     })

  })
