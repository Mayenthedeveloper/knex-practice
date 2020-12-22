
// const db = require('./knex-instance')

const ArticlesService = {
    getAllArticles(knex){
        return knex.select('*').from('blogful_articles')
    }
}

module.exports = ArticlesService