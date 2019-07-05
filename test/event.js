
import mongoose from 'mongoose'
import { Event } from '../models/index'

//Require the dev-dependencies
import chai from 'chai'
import chaiHttp from 'chai-http'
import app from '../index'
const should = chai.should()

chai.use(chaiHttp)

//parent block
describe('EVENTS', () => {
    before(done => { //mock data for testing
        Event.create([
            {
                name: 'Halloween Party',
                schedule: '2019-08-02 23:40',
                length: 4
            },
            {
                name: 'Halloween Party1',
                schedule: new Date(), //this item will be used for get-ongoing-event test case
                length: 4
            }
        ], (err) => {
            done()
        })
    })

    after(done => {
        Event.deleteMany({}, err => { //after the test, clear database
            done()
        })
    })

    //test valid /POST route 
    describe('/POST event', () => {
        it('it should create a new event', (done) => {
            const event = {
                name: 'test1',
                schedule: '2019-08-03 12:23',
                length: 4
            }

            chai.request(app)
                .post('/api/events/')
                .send({ ...event })
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('event')
                    res.body.event.should.have.property('name')
                    res.body.event.should.have.property('schedule')
                    res.body.event.should.have.property('length')
                })

            done()
        })
    })

    //test invalid /POST route
    describe('invalid /POST event', () => {
        it('it should NOT CREATE a new event with invalid time format', (done) => {
            const event = {
                name: 'test1',
                schedule: '2019-08-03 wrong-format',
                length: 4
            }

            chai.request(app)
                .post('/api/events/')
                .send({ ...event })
                .end((err, res) => {
                    res.should.have.status(500)

                    done()
                })
        })
    })

    describe('invalid /POST event', () => {
        it('it should NOT CREATE a new event with missing inputs', (done) => {
            const event = {
                name: 'test1',
                length: 4
            }

            chai.request(app)
                .post('/api/events/')
                .send({ ...event })
                .end((err, res) => {
                    res.should.have.status(400)

                    done()
                })
        })
    })

    //test invalid /GET route
    describe('invalid /GET events', () => {
        it('it should NOT GET events without query input(s)', (done) => {
            chai.request(app)
                .get('/api/events')
                .end((err, res) => {
                    res.should.have.status(400)

                    done()
                })
        })
    })

    //test valid /GET route
    describe('valid /GET events', () => {
        it('it should GET events with provided query(name)', done => {
            chai.request(app)
                .get(`/api/events?name=halloween`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('events')
                    res.body.events.should.be.a('array')
                    res.body.events.length.should.be.eql(2)

                    done()
                })
        })
    })

    describe('valid /GET events', () => {
        it('it should GET events with provided query(year, month, day)', done => {
            chai.request(app)
                .get(`/api/events?year=2019&month=8&day=2`)
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('events')
                    res.body.events.should.be.a('array')
                    res.body.events.length.should.be.eql(1)

                    done()
                })
        })
    })

    //test /GET ONGOING route
    describe('/GET ONGOING event', () => {
        it('it should get the ongoing events', done => {
            chai.request(app)
                .get('/api/events/ongoing')
                .end((err, res) => {
                    res.should.have.status(200)
                    res.body.should.be.a('object')
                    res.body.should.have.property('events')
                    res.body.events.should.be.a('array')
                    res.body.events.length.should.be.eql(1)
                    done()
                })
        })
    })

    //test /RANDOM routes
    describe('/RANDOM routes', () => {
        it('it should return NOT FOUND response with /RANDOM routes', (done) => {
            chai.request(app)
                .get('/RANDOM')
                .end((err, res) => {
                    res.should.have.status(404)
                    res.body.err.message.should.be.eql('Not Found')

                    done()
                })
        })
    })
})



