require('dotenv').config()
const app = require('../server.js')
const mongoose = require('mongoose')
const chai = require('chai')
const chaiHttp = require('chai-http')
const assert = chai.assert

const User = require('../models/user.js')
const Message = require('../models/message.js')
const user = require('../../../reddit/src/models/user.js')

chai.config.includeStack = true

const expect = chai.expect
const should = chai.should()
chai.use(chaiHttp)

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {}
  mongoose.modelSchemas = {}
  mongoose.connection.close()
  done()
})

const SAMPLE_OBJECT_ID = 'cccccccccccc' // 12 byte string
const SAMPLE_MESSAGE_ID = 'bbbbbbbbbbbb' // 12 byte string

describe('Message API endpoints', () => {
 
    beforeEach((done) => {
        const user = new User({
            username: 'David',
            password: '0000',
            _id: SAMPLE_OBJECT_ID
    
        })

        const sampleMessage = new Message({
            title: 'message_title',
            body: 'body',
            author: user._id,
            _id: SAMPLE_MESSAGE_ID
        })

        sampleMessage.save()
        .then(() => {
            done()
        })

    })

    afterEach((done) => {
        User.deleteOne({ username: 'David' })
        .then(() => {
            Message.deleteOne({ title: 'message_title' })
            .then(() => {
                done()
            })
        })
    })

    it('should load all messages', (done) => {
        chai.request(app)
        .get('/messages')
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body.messages).to.be.an("array")
            done()
        })
       
        //done()
    }).timeout(1500)

    it('should get one specific message', (done) => {
        chai.request(app)
        .get(`/messages/${SAMPLE_MESSAGE_ID}`)
        .end((err, res) => {
            if (err) { done(err) }
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body.title).to.equal('message_title')
            expect(res.body.body).to.equal('body')
            expect(res.body.author).to.equal('636363636363636363636363')
            done()
        })
    })

    it('should post a new message', (done) => {
        // TODO: Complete this
        chai.request(app)
        .post('/messages')
        .send({title: 'message_title'})
        .end((err, res) => {
            if (err) { done(err) }
            expect(res.body.message).to.be.an('object')
            expect(res.body.message).to.have.property('body')

            Message.findOne({title: 'message_title'}).then(message => {
                expect(message).to.be.an('object')
                done()
            })
        })

        done()
    })

    it('should update a message', (done) => {
       done()
    })

    it('should delete a message', (done) => {
        // TODO: Complete this
        done()
    })
})
