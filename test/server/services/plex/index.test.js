import chai from 'chai';
import chaiHttp from 'chai-http';
import nock from 'nock';
import responses from './mocks/plexResponses';
import app from '../../../../index';

chai.use(chaiHttp);
const should = chai.should();

describe('Users', () => {
  describe('GET plex/users', async () => {
    it('should get all plex users', (done) => {
      const usersResponse = `${__dirname}/mocks/getUsersResponse.xml`;
      nock('https://plex.tv')
        .get('/api/users?X-Plex-Token=testPlexApiToken')
        .replyWithFile(200, usersResponse, { 'Content-Type': 'text/xml' });

      chai
        .request(app)
        .get('/plex/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal(responses.getUsersParsed);
          done();
        });
    });
  });
});

describe('Most Watched', () => {
  describe('GET plex/most-watched?:type', async () => {
    it('should return most watched history', (done) => {
      nock('https://plex.mjrflix.com')
        .get('/library/all/top?type=2&limit=10&X-Plex-Token=testPlexApiToken')
        .reply(200, responses.mostWatchedRaw, {
          'Content-Type': 'text/json',
        });

      chai
        .request(app)
        .get('/plex/most-watched?type=2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal(responses.mostWatchedParsed);
          done();
        });
    });
  });

  describe('GET plex/most-watched?:accountID&:type', async () => {
    it('should return most watched history per account', (done) => {
      nock('https://plex.mjrflix.com')
        .get(
          '/library/all/top?accountID=22099864&type=2&limit=10&X-Plex-Token=testPlexApiToken',
        )
        .reply(200, responses.mostWatchedByAccountRaw, {
          'Content-Type': 'text/json',
        });

      chai
        .request(app)
        .get('/plex/most-watched?accountID=22099864&type=2')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal(responses.mostWatchedByAccountParsed);
          done();
        });
    });
  });
});

describe('Sections', () => {
  describe('GET plex/sections', async () => {
    it('should get sections', (done) => {
      nock('https://plex.mjrflix.com')
        .get('/library/sections?X-Plex-Token=testPlexApiToken')
        .reply(200, responses.sectionsRaw, {
          'Content-Type': 'text/json',
        });
      chai
        .request(app)
        .get('/plex/sections')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal(responses.sectionsParsed);
          done();
        });
    });
  });
});

describe('Library Data', () => {
  describe('GET plex/library?sectionId=3', async () => {
    it('should sections', (done) => {
      nock('https://plex.mjrflix.com')
        .get('/library/sections/3/all?X-Plex-Token=testPlexApiToken')
        .reply(200, responses.getLibraryDataBySectionRaw, {
          'Content-Type': 'text/json',
        });
      chai
        .request(app)
        .get('/plex/library/3')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.should.deep.equal(
            responses.getLibraryDataBySectionRaw.MediaContainer.Metadata,
          );
          done();
        });
    });
  });
});
