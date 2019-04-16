const route = require('express').Router()
const knex = require('knex')

const config = {
    client : 'sqlite3',
    userNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
}

const db = knex(config)

const mssg = {
    err: 'server error',
    notFound: 'not found',
    incomplete: 'incomplete data'
}

route.get('/', async (req, res) => {
    try{
        const zoos = await db('zoos')
        res.status(200).json(zoos)
    }catch (err) {
       res.status(500).json({message: mssg.err})
    }
})

route.get('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const zoo = await db('zoos').where({id}).first()
        if(zoo){
            res.status(200).json(zoo)
        }else{
            res.status(404).json({message: mssg.notFound})
        }
    }catch (err) {
       res.status(500).json({message: mssg.err})
    }
})

route.post('/', async (req, res) => {
    const {name} = req.body
    if(!name) {
        res.status(400).json({message: mssg.incomplete})
        return
    }
    try{
        const zoo = await db('zoos').insert(req.body)
        res.status(201).json(zoo)
    }catch (err) {
       res.status(500).json({message: mssg.err})
    }
})

route.put('/:id', async (req, res) => {
    const {id} = req.params
    const {name} = req.body
    if(!name) {
        res.status(400).json({message: mssg.incomplete})
        return
    }
    try{
        const count = await db('zoos').where({id}).update(req.body)
        if(count > 0){
            res.status(200).json(count)
        }else {
            res.status(404).json({message: mssg.notFound})
        }
    }catch (err) {
       res.status(500).json({message: mssg.err})
    }
})

route.delete('/:id', async (req, res) => {
    const {id} = req.params
    try{
        const count = await db('zoos').where({id}).del()
        if(count > 0){
            res.status(200).end()
        }else{
            res.status(404).json({message: mssg.notFound})
        }
    }catch(err) {
        res.status(500).json({message: mssg.err})
    }
})

module.exports = route