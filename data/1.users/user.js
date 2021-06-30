const faker = require('faker')
const ObjectID = require('mongodb').ObjectID

module.exports = [
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: true,
    verification: faker.random.uuid(),
    city: faker.address.city(),
    country: faker.address.country(),
    phone: faker.phone.phoneNumber(),
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: true,
    verification: faker.random.uuid(),
    city: faker.address.city(),
    country: faker.address.country(),
    phone: faker.phone.phoneNumber(),
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: true,
    verification: faker.random.uuid(),
    city: faker.address.city(),
    country: faker.address.country(),
    phone: faker.phone.phoneNumber(),
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  {
    name: faker.name.findName(),
    email: faker.internet.email(),
    password: '$2a$05$2KOSBnbb0r.0TmMrvefbluTOB735rF/KRZb4pmda4PdvU9iDvUB26',
    role: 'user',
    verified: true,
    verification: faker.random.uuid(),
    city: faker.address.city(),
    country: faker.address.country(),
    phone: faker.phone.phoneNumber(),
    urlTwitter: faker.internet.url(),
    urlGitHub: faker.internet.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent()
  },
  
]
